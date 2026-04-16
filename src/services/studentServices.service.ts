import DB from "@/database";

export class StudentServicesService {
  public async findByStudentId(studentDbId: string | number) {
    return await DB("student_services")
      .join("students", "student_services.student_db_id", "=", "students.id")
      .select("student_services.*", "students.student_id")
      .where("student_services.student_db_id", studentDbId)
      .orderBy("student_services.created_at", "desc");
  }

  public async findById(id: string | number) {
    const row = await DB("student_services")
      .join("students", "student_services.student_db_id", "=", "students.id")
      .select("student_services.*", "students.student_id")
      .where("student_services.id", id)
      .first();
    return row || null;
  }

  public async create(serviceData: any) {
    const insertObj = {
      student_db_id: serviceData.student_db_id,
      service_type: serviceData.service_type,
      service_name: serviceData.service_name,
      provider: serviceData.provider,
      status: serviceData.status,
      start_date: serviceData.start_date,
      end_date: serviceData.end_date,
      amount: serviceData.amount,
      currency: serviceData.currency,
      priority: serviceData.priority,
      notes: serviceData.notes,
      assigned_to: serviceData.assigned_to,
    };

    const res = await DB("student_services").insert(insertObj).returning("*");
    return res && res[0] ? res[0] : null;
  }

  public async update(id: string | number, serviceData: any) {
    const updateObj = {
      service_type: serviceData.service_type,
      service_name: serviceData.service_name,
      provider: serviceData.provider,
      status: serviceData.status,
      start_date: serviceData.start_date,
      end_date: serviceData.end_date,
      amount: serviceData.amount,
      currency: serviceData.currency,
      priority: serviceData.priority,
      notes: serviceData.notes,
      assigned_to: serviceData.assigned_to,
      updated_at: DB.fn.now(),
    };

    const res = await DB("student_services").where("id", id).update(updateObj).returning("*");
    return res && res[0] ? res[0] : null;
  }

  public async delete(id: string | number) {
    const res = await DB("student_services").where("id", id).del().returning("*");
    return !!(res && res.length > 0);
  }
}
