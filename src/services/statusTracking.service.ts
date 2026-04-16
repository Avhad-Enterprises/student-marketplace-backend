import DB from "@/database";

export class StatusTrackingService {
  public async findByStudentId(studentId: string) {
    return await DB("status_history as sh")
      .join("students as s", "sh.student_db_id", "s.id")
      .select("sh.*", "s.first_name", "s.last_name")
      .where("s.student_id", studentId)
      .orderBy("sh.created_at", "desc");
  }

  public async findAll(stage?: string, risk_level?: string, search?: string) {
    // Refactor N+1 query problem by using JOIN with DISTINCT ON to get the latest status for all students in one go
    const studentsWithStatus = await DB("students as s")
      .leftJoin(
        DB("status_history")
          .select("student_db_id", "sub_status", "created_at")
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
        "s.risk_level",
        "s.current_stage as stage",
        "s.current_country as country",
        "s.assigned_counselor as counselor",
        "sh.sub_status",
        "sh.created_at as last_update"
      )
      .modify((qb) => {
        if (stage) qb.where("s.current_stage", stage);
        if (risk_level) qb.where("s.risk_level", risk_level);
        if (search) {
          const like = `%${search}%`;
          qb.where(function () {
            this.where("s.first_name", "ILIKE", like).orWhere("s.last_name", "ILIKE", like).orWhere("s.student_id", "ILIKE", like);
          });
        }
      });

    return studentsWithStatus.sort((a: any, b: any) => {
      if (!a.last_update) return 1;
      if (!b.last_update) return -1;
      return new Date(b.last_update).getTime() - new Date(a.last_update).getTime();
    });
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

    // For Awaiting Decision and Blocked, we need to check sub_status in the latest status_history for each student
    const awaitingDecision = await DB("students as s")
      .join(
        DB("status_history")
          .select("student_db_id", "sub_status")
          .distinctOn("student_db_id")
          .orderBy("student_db_id")
          .orderBy("created_at", "desc")
          .as("latest_status"),
        "s.id",
        "latest_status.student_db_id"
      )
      .where(function () {
        this.where("latest_status.sub_status", "ILIKE", "%Awaiting%")
          .orWhere("latest_status.sub_status", "ILIKE", "%Review%");
      })
      .count("* as count")
      .first();

    const blockedCount = await DB("students as s")
      .join(
        DB("status_history")
          .select("student_db_id", "sub_status")
          .distinctOn("student_db_id")
          .orderBy("student_db_id")
          .orderBy("created_at", "desc")
          .as("latest_status"),
        "s.id",
        "latest_status.student_db_id"
      )
      .where(function () {
        this.where("latest_status.sub_status", "ILIKE", "%Blocked%")
          .orWhere("latest_status.sub_status", "ILIKE", "%Stalled%")
          .orWhere("latest_status.sub_status", "ILIKE", "%Rejected%");
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
      if (stage) query.where("s.current_stage", stage);
      if (risk_level) query.where("s.risk_level", risk_level);
      if (search) {
        const like = `%${search}%`;
        query.where(function () {
          this.where("s.first_name", "ILIKE", like).orWhere("s.last_name", "ILIKE", like).orWhere("s.student_id", "ILIKE", like);
        });
      }
    }

    return await query;
  }
}
