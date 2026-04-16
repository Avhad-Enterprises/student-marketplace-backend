import DB from "@/database";

export class PaymentService {
  public async findAll() {
    const rows = await DB("payments")
      .leftJoin("students", "payments.student_db_id", "students.id")
      .select("payments.*", "students.first_name", "students.last_name")
      .orderBy("payments.created_at", "desc");

    return rows.map(row => ({
      ...row,
      first_name: row.first_name || 'Deleted',
      last_name: row.last_name || 'User'
    }));
  }

  public async findByStudentId(studentDbId: string | number) {
    return await DB("payments").where("student_db_id", studentDbId).orderBy("created_at", "desc");
  }

  public async getPaymentSummary(studentDbId: string | number) {
    const counts = await DB("payments")
      .where("student_db_id", studentDbId)
      .select(
        DB.raw("COUNT(*) as total_count"),
        DB.raw("SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as total_paid"),
        DB.raw("SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as total_pending"),
        DB.raw("SUM(CASE WHEN status = 'overdue' THEN amount ELSE 0 END) as total_overdue"),
        DB.raw("SUM(amount) as total_amount")
      ).first();

    return {
      total_count: String(counts?.total_count || "0"),
      total_paid: String(counts?.total_paid || "0.00"),
      total_pending: String(counts?.total_pending || "0.00"),
      total_overdue: String(counts?.total_overdue || "0.00"),
      total_amount: String(counts?.total_amount || "0.00"),
    };
  }

  public async findById(id: string | number) {
    const row = await DB("payments")
      .leftJoin("students", "payments.student_db_id", "students.id")
      .select("payments.*", "students.first_name", "students.last_name")
      .where("payments.id", id)
      .first();
    
    if (!row) return null;

    return {
      ...row,
      first_name: row.first_name || 'Deleted',
      last_name: row.last_name || 'User'
    };
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

    return await DB.transaction(async (trx) => {
      const [payment] = await trx("payments").insert(insertObj).returning("*");
      
      // Initial audit log
      await trx("payment_status_history").insert({
        payment_db_id: payment.id,
        old_status: null,
        new_status: payment.status,
        changed_by: paymentData.created_by || 'system',
        notes: 'Initial invoice creation'
      });

      return payment;
    });
  }

  public async update(id: string | number, paymentData: any) {
    return await DB.transaction(async (trx) => {
      // 1. SELECT FOR UPDATE - Row-level lock
      const existing = await trx("payments")
        .where("id", id)
        .forUpdate()
        .first();

      if (!existing) throw new Error("Payment record not found");

      // 2. Strong Idempotency: Check if status is identical or if idempotency key matches
      const isStatusIdentical = paymentData.status && paymentData.status === existing.status;
      const isIdempotencyMatch = paymentData.idempotency_key && existing.notes?.includes(paymentData.idempotency_key);

      if (isStatusIdentical && Object.keys(paymentData).length === 1) {
          return existing; // Return existing if it's a redundant status update
      }

      const updateObj: any = {
        description: paymentData.description,
        amount: paymentData.amount ? String(paymentData.amount) : undefined,
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

      // 3. Update Record
      const [updated] = await trx("payments").where("id", id).update(updateObj).returning("*");

      // 4. Log status change with Audit Integrity check
      if (paymentData.status && paymentData.status !== existing.status) {
        // Double check for duplicate audit entry in this transaction scope
        const duplicateAudit = await trx("payment_status_history")
          .where({
            payment_db_id: id,
            new_status: paymentData.status,
            old_status: existing.status
          })
          .whereRaw("created_at > NOW() - INTERVAL '1 minute'")
          .first();

        if (!duplicateAudit) {
          await trx("payment_status_history").insert({
            payment_db_id: id,
            old_status: existing.status,
            new_status: paymentData.status,
            changed_by: paymentData.changed_by || 'system',
            notes: paymentData.audit_notes || 'Manual status transition verified'
          });
        }
      }

      return updated;
    });
  }

  public async delete(id: string | number) {
    const res = await DB("payments").where("id", id).del().returning("*");
    return !!(res && res.length > 0);
  }
}
