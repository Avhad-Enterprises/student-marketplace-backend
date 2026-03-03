import DB from "@/database";

export class DocumentService {
  public async findByStudentId(studentDbId: string | number) {
    return await DB("documents").where("student_db_id", studentDbId).orderBy("created_at", "desc");
  }

  public async findById(id: string | number) {
    const row = await DB("documents").where("id", id).first();
    return row || null;
  }

  public async create(documentData: any) {
    const insertObj = {
      student_db_id: documentData.studentDbId,
      name: documentData.name,
      category: documentData.category,
      status: documentData.status,
      file_type: documentData.file_type,
      file_size: documentData.file_size,
      uploaded_by: documentData.uploaded_by,
      file_url: documentData.file_url,
    };

    const res = await DB("documents").insert(insertObj).returning("*");
    return res && res[0] ? res[0] : null;
  }

  public async update(id: string | number, documentData: any) {
    const updateObj = {
      name: documentData.name,
      category: documentData.category,
      status: documentData.status,
      file_type: documentData.file_type,
      file_size: documentData.file_size,
      uploaded_by: documentData.uploaded_by,
      file_url: documentData.file_url,
      updated_at: DB.fn.now(),
    };

    const res = await DB("documents").where("id", id).update(updateObj).returning("*");
    return res && res[0] ? res[0] : null;
  }

  public async delete(id: string | number) {
    const res = await DB("documents").where("id", id).del().returning("*");
    return !!(res && res.length > 0);
  }
}
