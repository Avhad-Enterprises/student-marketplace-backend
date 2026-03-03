import DB from "@/database";

export class ApplicationService {
  public async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: string,
    student_id?: string,
    sort: string = "created_at",
    order: string = "desc"
  ) {
    const offset = (page - 1) * limit;

    const baseQuery = DB("applications as a").join("students as s", "a.student_db_id", "s.id");

    if (search) {
      const like = `%${search}%`;
      baseQuery.where(function () {
        this.where("s.first_name", "ILIKE", like)
          .orWhere("s.last_name", "ILIKE", like)
          .orWhere("a.university_name", "ILIKE", like)
          .orWhere("a.application_id", "ILIKE", like);
      });
    }

    if (status) baseQuery.where("a.status", status);
    if (student_id) baseQuery.where("s.student_id", student_id);

    const totalObj = await baseQuery.clone().count("a.id as count").first();
    const total = parseInt((totalObj && (totalObj as any).count) || "0");

    const validSortFields = ["created_at", "university_name", "status", "submission_date"];
    const finalSort = validSortFields.includes(sort) ? `a.${sort}` : "a.created_at";
    const finalOrder = order.toLowerCase() === "asc" ? "asc" : "desc";

    const data = await baseQuery
      .clone()
      .select("a.*", "s.first_name", "s.last_name", "s.student_id as stu_id")
      .orderBy(finalSort, finalOrder as "asc" | "desc")
      .limit(limit)
      .offset(offset);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  public async getMetrics() {
    const totalRes = await DB("applications").count("* as count").first();
    const inProgress = await DB("applications").where("status", "in-progress").count("* as count").first();
    const submitted = await DB("applications").where("status", "submitted").count("* as count").first();
    const decisions = await DB("applications").where("status", "decision-received").count("* as count").first();
    const pendingDocs = await DB("applications").where("status", "pending-docs").count("* as count").first();

    return {
      totalApplications: parseInt(((totalRes as any) || {}).count || "0"),
      inProgress: parseInt(((inProgress as any) || {}).count || "0"),
      submitted: parseInt(((submitted as any) || {}).count || "0"),
      decisions: parseInt(((decisions as any) || {}).count || "0"),
      pendingDocs: parseInt(((pendingDocs as any) || {}).count || "0"),
    };
  }

  public async findById(id: string | number) {
    const result = await DB("applications").where("id", id).first();
    return result || null;
  }

  public async create(applicationData: any) {
    const application_id = `APP-${Date.now()}`;

    const insertObj = {
      application_id,
      student_db_id: applicationData.studentDbId,
      university_name: applicationData.universityName,
      country: applicationData.country,
      intake: applicationData.intake,
      status: applicationData.status || "in-progress",
      counselor: applicationData.counselor,
      submission_date: applicationData.submissionDate || null,
      decision_date: applicationData.decisionDate || null,
      notes: applicationData.notes,
    };

    const res = await DB("applications").insert(insertObj).returning(["id", "application_id"]);
    return res && res[0] ? res[0] : null;
  }

  public async update(id: string | number, applicationData: any) {
    const updateObj = {
      university_name: applicationData.universityName,
      country: applicationData.country,
      intake: applicationData.intake,
      status: applicationData.status,
      counselor: applicationData.counselor,
      submission_date: applicationData.submissionDate,
      decision_date: applicationData.decisionDate,
      notes: applicationData.notes,
      updated_at: DB.fn.now(),
    };

    const res = await DB("applications").where("id", id).update(updateObj).returning("*");
    return res && res[0] ? res[0] : null;
  }

  public async delete(id: string | number) {
    const res = await DB("applications").where("id", id).del().returning("*");
    return res && res.length > 0;
  }
}
