import DB from "@/database";

export class ActivityService {
  public async findByStudentId(studentDbId: string | number) {
    return await DB("activities")
      .where("student_db_id", studentDbId)
      .orderBy("created_at", "desc");
  }

  public async findById(id: string | number) {
    const row = await DB("activities").where("id", id).first();
    return row || null;
  }

  public async create(activityData: any) {
    const insertObj = {
      student_db_id: activityData.student_db_id,
      title: activityData.title,
      content: activityData.content,
      type: activityData.type,
    };

    const res = await DB("activities").insert(insertObj).returning("*");
    return res && res[0] ? res[0] : null;
  }

  public async update(id: string | number, activityData: any) {
    const updateObj = {
      title: activityData.title,
      content: activityData.content,
      type: activityData.type,
      updated_at: DB.fn.now(),
    };

    const res = await DB("activities").where("id", id).update(updateObj).returning("*");
    return res && res[0] ? res[0] : null;
  }

  public async delete(id: string | number) {
    const res = await DB("activities").where("id", id).del().returning("*");
    return !!(res && res.length > 0);
  }
}
