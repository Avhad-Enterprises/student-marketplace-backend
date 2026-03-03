import DB from "@/database";

export class PartnerService {
  public async findByStudentId(studentDbId: string | number) {
    return await DB("partners").where("student_db_id", studentDbId).orderBy("created_at", "desc");
  }

  public async findById(id: string | number) {
    const row = await DB("partners").where("id", id).first();
    return row || null;
  }

  public async create(partnerData: any) {
    const insertObj = {
      student_db_id: partnerData.student_db_id,
      name: partnerData.name,
      partner_type: partnerData.partner_type,
      status: partnerData.status,
    };

    const res = await DB("partners").insert(insertObj).returning("*");
    return res && res[0] ? res[0] : null;
  }

  public async update(id: string | number, partnerData: any) {
    const updateObj = {
      name: partnerData.name,
      partner_type: partnerData.partner_type,
      status: partnerData.status,
      updated_at: DB.fn.now(),
    };

    const res = await DB("partners").where("id", id).update(updateObj).returning("*");
    return res && res[0] ? res[0] : null;
  }

  public async delete(id: string | number) {
    const res = await DB("partners").where("id", id).del().returning("*");
    return !!(res && res.length > 0);
  }
}
