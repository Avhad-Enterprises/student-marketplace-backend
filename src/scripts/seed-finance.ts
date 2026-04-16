import DB from "../database";

async function seedFinance() {
  console.log("🚀 Starting Financial Data Seeding...");

  try {
    // 1. Get existing students to link
    const students = await DB("students").select("id", "first_name", "last_name").limit(5);

    if (students.length === 0) {
      console.error("❌ No students found. Please seed students first.");
      process.exit(1);
    }

    const statuses = ["paid", "pending", "overdue", "refunded"];
    const methods = ["Credit Card", "Bank Transfer", "PayPal", "Stripe"];
    const services = ["Tuition", "Accommodation", "Visa Fee", "Service Fee"];

    const payments: any[] = [];

    // 2. Generate 12 varied financial records
    for (let i = 1; i <= 12; i++) {
      const student = students[i % students.length];
      const amount = (Math.random() * 5000 + 500).toFixed(2);
      const status = statuses[i % statuses.length];

      payments.push({
        student_db_id: student.id,
        payment_id: `PAY-QA-${Date.now()}-${i}`,
        invoice_number: `INV-AUDIT-${1000 + i}`,
        description: `${services[i % services.length]} for ${student.first_name}`,
        amount: amount, // Keep as string for DECIMAL precision
        currency: "USD",
        service_type: services[i % services.length],
        status: status,
        payment_method: methods[i % methods.length],
        due_date: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
        paid_date: status === 'paid' ? new Date().toISOString().split('T')[0] : null,
        created_by: "QA Auditor",
        notes: `Seed data for functional verification of the Finance Module. Record #${i}`,
      });
    }

    // 3. Insert and Create Audit History
    await DB.transaction(async (trx) => {
      // Clear existing seed data if any (optional, but good for repeatable tests)
      await trx("payments").where("invoice_number", "LIKE", "INV-AUDIT-%").del();

      const inserted = await trx("payments").insert(payments).returning("*");
      
      const history = inserted.map(p => ({
        payment_db_id: p.id,
        old_status: null,
        new_status: p.status,
        changed_by: "QA Auditor",
        notes: "Initial seed creation for audit verification"
      }));

      await trx("payment_status_history").insert(history);
      
      console.log(`✅ Successfully seeded ${inserted.length} institutional financial records.`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedFinance();
