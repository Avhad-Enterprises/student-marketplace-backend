import DB from "@/database";

export class PaymentService {
  public async findAll() {
    return await DB("payments")
      .leftJoin("students", "payments.student_db_id", "students.id")
      .select("payments.*", "students.first_name", "students.last_name")
      .orderBy("payments.created_at", "desc");
  }

  public async findByStudentId(studentDbId: string | number) {
    return await DB("payments").where("student_db_id", studentDbId).orderBy("created_at", "desc");
  }

  public async getPaymentSummary(studentDbId: string | number) {
    const totalRow = await DB("payments").where("student_db_id", studentDbId).count("* as total_count").first();
    const paidRow = await DB("payments").where("student_db_id", studentDbId).where("status", "paid").sum("amount as total_paid").first();
    const pendingRow = await DB("payments").where("student_db_id", studentDbId).where("status", "pending").sum("amount as total_pending").first();
    const overdueRow = await DB("payments").where("student_db_id", studentDbId).where("status", "overdue").sum("amount as total_overdue").first();
    const amountRow = await DB("payments").where("student_db_id", studentDbId).sum("amount as total_amount").first();

    return {
      total_count: parseInt(((totalRow as any) || {}).total_count || 0),
      total_paid: parseFloat(((paidRow as any) || {}).total_paid || 0),
      total_pending: parseFloat(((pendingRow as any) || {}).total_pending || 0),
      total_overdue: parseFloat(((overdueRow as any) || {}).total_overdue || 0),
      total_amount: parseFloat(((amountRow as any) || {}).total_amount || 0),
    };
  }

  public async findById(id: string | number) {
    const row = await DB("payments").where("id", id).first();
    return row || null;
  }

  public async create(paymentData: any) {
    // 1. Validation
    if (!paymentData.amount || Number(paymentData.amount) <= 0) {
      throw new Error("Invalid amount. Amount must be greater than 0.");
    }
    if (!paymentData.student_db_id || Number(paymentData.student_db_id) <= 0) {
      throw new Error("Missing Student. Please select a student for this invoice.");
    }

    // 2. Generate unique invoice number if not provided
    const invoice_number = paymentData.invoice_number || `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const insertObj = {
      student_db_id: paymentData.student_db_id,
      payment_id: paymentData.payment_id || `PAY-${Date.now()}`,
      invoice_number,
      description: paymentData.description,
      amount: paymentData.amount,
      currency: paymentData.currency || 'USD',
      service_type: paymentData.service_type,
      status: paymentData.status || 'pending',
      payment_method: paymentData.payment_method,
      due_date: paymentData.due_date,
      paid_date: paymentData.paid_date,
      created_by: paymentData.created_by,
      notes: paymentData.notes,
    };

    const res = await DB("payments").insert(insertObj).returning("*");
    return res && res[0] ? res[0] : null;
  }

  public async update(id: string | number, paymentData: any) {
    if (paymentData.amount !== undefined && Number(paymentData.amount) <= 0) {
      throw new Error("Invalid amount. Amount must be greater than 0.");
    }

    const updateObj: any = {
      description: paymentData.description,
      amount: paymentData.amount,
      currency: paymentData.currency,
      service_type: paymentData.service_type,
      status: paymentData.status,
      payment_method: paymentData.payment_method,
      due_date: paymentData.due_date,
      paid_date: paymentData.paid_date,
      notes: paymentData.notes,
      updated_at: DB.fn.now(),
    };

    // Clean undefined values
    Object.keys(updateObj).forEach(key => updateObj[key] === undefined && delete updateObj[key]);

    const res = await DB("payments").where("id", id).update(updateObj).returning("*");
    return res && res[0] ? res[0] : null;
  }

  public async delete(id: string | number) {
    const res = await DB("payments").where("id", id).del().returning("*");
    return !!(res && res.length > 0);
  }
}
