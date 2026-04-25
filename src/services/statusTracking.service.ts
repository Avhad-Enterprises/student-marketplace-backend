import DB from "@/database";

export class StatusTrackingService {
  public async findByStudentId(studentId: string) {
    return await DB("status_history as sh")
      .join("students as s", "sh.student_db_id", "s.id")
      .select("sh.*", "s.first_name", "s.last_name")
      .where("s.student_id", studentId)
      .orderBy("sh.created_at", "desc");
  }

  public async findAll(params: { 
    stage?: string; 
    risk_level?: string; 
    search?: string; 
    limit?: number; 
    page?: number; 
    sort?: string; 
    order?: 'asc' | 'desc' 
  }) {
    const { stage, risk_level, search, limit = 10, page = 1, sort = 'last_update', order = 'desc' } = params;
    const offset = (page - 1) * limit;

    // Subquery for latest status
    const latestStatusSubquery = DB("status_history")
      .select("student_db_id", "sub_status", "created_at")
      .distinctOn("student_db_id")
      .orderBy("student_db_id")
      .orderBy("created_at", "desc");

    // Base query used for both count and data to ensure consistency
    const baseQuery = DB("students as s")
      .leftJoin(latestStatusSubquery.as("sh"), "s.id", "sh.student_db_id");

    const applyFilters = (qb: any) => {
      if (stage && stage.trim() !== "" && stage !== 'all') {
        qb.where("s.current_stage", stage);
      }
      if (risk_level && risk_level.trim() !== "" && risk_level !== 'all') {
        qb.where("s.risk_level", risk_level);
      }
      if (search && search.trim() !== "") {
        const like = `%${search}%`;
        qb.where(function (this: any) {
          this.whereILike("s.first_name", like)
            .orWhereILike("s.last_name", like)
            .orWhereILike("s.email", like)
            .orWhereILike("s.student_id", like)
            .orWhereILike("s.current_country", like)
            .orWhereILike("s.assigned_counselor", like)
            .orWhereILike("sh.sub_status", like); // Now safe to search because of the join in baseQuery
        });
      }
    };

    applyFilters(baseQuery);

    // Get total count
    const countResult = await baseQuery.clone().count("* as count").first();
    const total = parseInt((countResult as any).count || "0");

    // Get paginated data
    const data = await baseQuery
      .select(
        "s.id as db_id",
        "s.student_id",
        "s.first_name",
        "s.last_name",
        "s.email",
        "s.account_status",
        "s.risk_level",
        "s.current_stage as stage",
        "s.current_country as country",
        "s.assigned_counselor as counselor",
        "sh.sub_status",
        "sh.created_at as last_update"
      )
      .modify((qb) => {
        const dir = order.toUpperCase();
        if (sort === 'last_update') {
          qb.orderByRaw(`sh.created_at ${dir} NULLS LAST`)
            .orderBy("s.created_at", "desc");
        } else if (sort === 'stage') {
          qb.orderBy("s.current_stage", dir);
        } else if (sort === 'student') {
          qb.orderBy("s.first_name", dir);
        } else {
          const validSortFields = ['first_name', 'last_name', 'email', 'created_at', 'student_id', 'risk_level'];
          const finalSort = validSortFields.includes(sort) ? `s.${sort}` : 's.created_at';
          qb.orderBy(finalSort, dir);
        }
      })
      .limit(limit)
      .offset(offset);

    return {
      data,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  public async updateStatus(studentDbId: number, stage: string, subStatus: string, notes: string, changedBy: string) {
    await DB.transaction(async (trx) => {
      await trx("status_history").insert({ student_db_id: studentDbId, stage, sub_status: subStatus, notes, changed_by: changedBy });
      await trx("students").where("id", studentDbId).update({ current_stage: stage, updated_at: DB.fn.now() });
    });

    return { message: "Status updated successfully" };
  }

  public async getMetrics() {
    const applicationCount = await DB("students").where("current_stage", "application").count("* as count").first();
    const visaCount = await DB("students").where("current_stage", "visa").count("* as count").first();
    const completedCount = await DB("students").where("current_stage", "completed").count("* as count").first();

    const latestStatusSubquery = DB("status_history")
      .select("student_db_id", "sub_status")
      .distinctOn("student_db_id")
      .orderBy("student_db_id")
      .orderBy("created_at", "desc");

    const awaitingDecision = await DB("students as s")
      .join(latestStatusSubquery.as("ls"), "s.id", "ls.student_db_id")
      .where(function (this: any) {
        this.where("ls.sub_status", "ILIKE", "%Awaiting%")
          .orWhere("ls.sub_status", "ILIKE", "%Review%");
      })
      .count("* as count")
      .first();

    const blockedCount = await DB("students as s")
      .join(latestStatusSubquery.as("ls"), "s.id", "ls.student_db_id")
      .where(function (this: any) {
        this.where("ls.sub_status", "ILIKE", "%Blocked%")
          .orWhere("ls.sub_status", "ILIKE", "%Stalled%")
          .orWhere("ls.sub_status", "ILIKE", "%Rejected%");
      })
      .count("* as count")
      .first();

    return {
      applicationCount: parseInt(((applicationCount as any) || {}).count || "0"),
      visaCount: parseInt(((visaCount as any) || {}).count || "0"),
      awaitingDecisionCount: parseInt(((awaitingDecision as any) || {}).count || "0"),
      completedCount: parseInt(((completedCount as any) || {}).count || "0"),
      blockedCount: parseInt(((blockedCount as any) || {}).count || "0")
    };
  }

  public async exportLeads(ids?: (string | number)[], stage?: string, risk_level?: string, search?: string) {
    const query = DB("students as s")
      .leftJoin(
        DB("status_history")
          .select("student_db_id", "sub_status", "created_at", "notes", "changed_by")
          .distinctOn("student_db_id")
          .orderBy("student_db_id")
          .orderBy("created_at", "desc")
          .as("sh"),
        "s.id",
        "sh.student_db_id"
      )
      .select(
        "s.id as db_id",
        "s.student_id",
        "s.first_name",
        "s.last_name",
        "s.email",
        "s.risk_level",
        "s.current_stage as stage",
        "s.current_country as country",
        "s.assigned_counselor as counselor",
        "sh.sub_status",
        "sh.created_at as last_update",
        "sh.notes as last_notes"
      );

    if (ids && ids.length > 0) {
      query.whereIn("s.id", ids);
    } else {
      if (stage && stage.trim() !== "" && stage !== 'all') query.where("s.current_stage", stage);
      if (risk_level && risk_level.trim() !== "" && risk_level !== 'all') query.where("s.risk_level", risk_level);
      if (search && search.trim() !== "") {
        const like = `%${search}%`;
        query.where(function (this: any) {
          this.whereILike("s.first_name", like)
            .orWhereILike("s.last_name", like)
            .orWhereILike("s.email", like)
            .orWhereILike("s.student_id", like)
            .orWhereILike("s.current_country", like)
            .orWhereILike("s.assigned_counselor", like)
            .orWhereILike("sh.sub_status", like);
        });
      }
    }

    return await query;
  }
}
