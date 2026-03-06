import DB from "@/database";

export class CommunicationService {
  public async findByStudentId(studentDbId: string | number) {
    return await DB("communications")
      .where("student_db_id", studentDbId)
      .orderBy("created_at", "desc");
  }

  public async findAll() {
    return await DB("communications")
      .orderBy("created_at", "desc");
  }

  public async findById(id: string | number) {
    const row = await DB("communications").where("id", id).first();
    return row || null;
  }

  public async create(communicationData: any) {
    const insertObj = {
      student_db_id: communicationData.student_db_id,
      type: communicationData.type,
      status: communicationData.status,
      content: communicationData.content,
      sender: communicationData.sender,
    };

    const res = await DB("communications").insert(insertObj).returning("*");
    return res && res[0] ? res[0] : null;
  }

  public async update(id: string | number, communicationData: any) {
    const updateObj = {
      type: communicationData.type,
      status: communicationData.status,
      content: communicationData.content,
      sender: communicationData.sender,
      updated_at: DB.fn.now(),
    };

    const res = await DB("communications").where("id", id).update(updateObj).returning("*");
    return res && res[0] ? res[0] : null;
  }

  public async delete(id: string | number) {
    const res = await DB("communications").where("id", id).del().returning("*");
    return !!(res && res.length > 0);
  }
}
