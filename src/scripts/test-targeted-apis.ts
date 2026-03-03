import http from "http";
import 'dotenv/config';

function request(
  path: string,
  method: string = "GET",
  data: any = null
): Promise<{ status: number; body: any }> {
  return new Promise((resolve, reject) => {
    const port = process.env.PORT || 5000;
    const options: any = {
      hostname: "localhost",
      port: port,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (data) {
      const jsonData = JSON.stringify(data);
      options.headers["Content-Length"] = Buffer.byteLength(jsonData);
    }

    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode || 500, body: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode || 500, body: body });
        }
      });
    });

    req.on("error", (e) => reject(e));

    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function run() {
  console.log("🔬 Running targeted API tests...\n");

  // 1) Create a test student
  const now = Date.now();
  const createStudentPayload = {
    firstName: "Test",
    lastName: "User",
    email: `test+${now}@example.com`,
  };

  const created = await request("/api/students", "POST", createStudentPayload);
  if (created.status < 200 || created.status >= 300) {
    console.error("Failed to create test student", created);
    return;
  }

  const studentDbId = created.body.id || (created.body && created.body.id);
  const studentId = created.body.student_id || (created.body && created.body.student_id);
  console.log(`Created student: dbId=${studentDbId} studentId=${studentId}\n`);

  // Helper to print step results
  async function step(name: string, fn: () => Promise<void>) {
    try {
      process.stdout.write(`• ${name} ... `);
      await fn();
      console.log("OK");
    } catch (e: any) {
      console.log("FAILED");
      console.error(e && e.message ? e.message : e);
    }
  }

  // STUDENT: read, update, profile
  await step("GET /api/students/:id", async () => {
    const res = await request(`/api/students/${studentDbId}`);
    if (res.status !== 200) throw new Error(`status ${res.status}`);
  });

  await step("PUT /api/students/:id", async () => {
    const res = await request(`/api/students/${studentDbId}`, "PUT", { firstName: "Updated" });
    if (res.status !== 200) throw new Error(`status ${res.status}`);
  });

  await step("GET /api/students/:id/profile-completion", async () => {
    const res = await request(`/api/students/${studentDbId}/profile-completion`);
    if (res.status !== 200) throw new Error(`status ${res.status}`);
  });

  // DOCUMENTS CRUD
  let docId: any = null;
  await step("POST /api/documents", async () => {
    const payload = { studentDbId, name: "Passport", category: "ID", status: "active", file_type: "pdf", file_size: 12345, uploaded_by: "tester", file_url: "https://example.com/doc.pdf" };
    const res = await request(`/api/documents`, "POST", payload);
    if (res.status !== 201) throw new Error(`status ${res.status}`);
    docId = res.body.id || res.body;
  });

  await step("GET /api/documents/:studentDbId", async () => {
    const res = await request(`/api/documents/${studentDbId}`);
    if (res.status !== 200) throw new Error(`status ${res.status}`);
  });

  await step("PUT /api/documents/:id", async () => {
    const res = await request(`/api/documents/${docId}`, "PUT", { name: "Passport Updated" });
    if (res.status !== 200) throw new Error(`status ${res.status}`);
  });

  await step("DELETE /api/documents/:id", async () => {
    const res = await request(`/api/documents/${docId}`, "DELETE");
    if (res.status !== 200) throw new Error(`status ${res.status}`);
  });

  // NOTES CRUD + toggle
  let noteId: any = null;
  await step("POST /api/notes", async () => {
    const res = await request(`/api/notes`, "POST", { student_db_id: studentDbId, note_type: "private", title: "Note1", content: "hello", created_by: "tester" });
    if (res.status !== 201) throw new Error(`status ${res.status}`);
    noteId = res.body.id || res.body;
  });

  await step("PUT /api/notes/:id/pin", async () => {
    const res = await request(`/api/notes/${noteId}/pin`, "PUT");
    if (res.status !== 200) throw new Error(`status ${res.status}`);
  });

  await step("PUT /api/notes/:id", async () => {
    const res = await request(`/api/notes/${noteId}`, "PUT", { title: "Updated Note" });
    if (res.status !== 200) throw new Error(`status ${res.status}`);
  });

  await step("DELETE /api/notes/:id", async () => {
    const res = await request(`/api/notes/${noteId}`, "DELETE");
    if (res.status !== 200) throw new Error(`status ${res.status}`);
  });

  // PAYMENTS CRUD
  let paymentId: any = null;
  await step("POST /api/payments", async () => {
    const payload = { student_db_id: studentDbId, payment_id: `P-${now}`, invoice_number: `INV-${now}`, description: "Test payment", amount: 100, currency: "USD", status: "pending", payment_method: "card", due_date: null, paid_date: null, created_by: "tester", notes: null };
    const res = await request(`/api/payments`, "POST", payload);
    if (res.status !== 201) throw new Error(`status ${res.status}`);
    paymentId = res.body.id || res.body;
  });

  await step("GET /api/payments/:studentDbId", async () => {
    const res = await request(`/api/payments/${studentDbId}`);
    if (res.status !== 200) throw new Error(`status ${res.status}`);
  });

  await step("PUT /api/payments/:id", async () => {
    const res = await request(`/api/payments/${paymentId}`, "PUT", { status: "paid" });
    if (res.status !== 200) throw new Error(`status ${res.status}`);
  });

  await step("DELETE /api/payments/:id", async () => {
    const res = await request(`/api/payments/${paymentId}`, "DELETE");
    if (res.status !== 200) throw new Error(`status ${res.status}`);
  });

  // ACTIVITIES CRUD
  let activityId: any = null;
  await step("POST /api/activities", async () => {
    const res = await request(`/api/activities`, "POST", { student_db_id: studentDbId, title: "Act1", content: "doing stuff", type: "log" });
    if (res.status !== 201) throw new Error(`status ${res.status}`);
    activityId = res.body.id || res.body;
  });

  await step("GET /api/activities/:studentDbId", async () => {
    const res = await request(`/api/activities/${studentDbId}`);
    if (res.status !== 200) throw new Error(`status ${res.status}`);
  });

  await step("PUT /api/activities/:id", async () => {
    const res = await request(`/api/activities/${activityId}`, "PUT", { title: "Act1 Updated" });
    if (res.status !== 200) throw new Error(`status ${res.status}`);
  });

  await step("DELETE /api/activities/:id", async () => {
    const res = await request(`/api/activities/${activityId}`, "DELETE");
    if (res.status !== 200) throw new Error(`status ${res.status}`);
  });

  // COMMUNICATIONS CRUD
  let commId: any = null;
  await step("POST /api/communications", async () => {
    const res = await request(`/api/communications`, "POST", { student_db_id: studentDbId, type: "email", status: "sent", content: "hello", sender: "tester" });
    if (res.status !== 201) throw new Error(`status ${res.status}`);
    commId = res.body.id || res.body;
  });

  await step("GET /api/communications/:studentDbId", async () => {
    const res = await request(`/api/communications/${studentDbId}`);
    if (res.status !== 200) throw new Error(`status ${res.status}`);
  });

  await step("PUT /api/communications/:id", async () => {
    const res = await request(`/api/communications/${commId}`, "PUT", { status: "read" });
    if (res.status !== 200) throw new Error(`status ${res.status}`);
  });

  await step("DELETE /api/communications/:id", async () => {
    const res = await request(`/api/communications/${commId}`, "DELETE");
    if (res.status !== 200) throw new Error(`status ${res.status}`);
  });

  // PARTNERS CRUD
  let partnerId: any = null;
  await step("POST /api/partners", async () => {
    const res = await request(`/api/partners`, "POST", { student_db_id: studentDbId, name: "Partner1", partner_type: "agency", status: "active" });
    if (res.status !== 201) throw new Error(`status ${res.status}`);
    partnerId = res.body.id || res.body;
  });

  await step("GET /api/partners/:studentDbId", async () => {
    const res = await request(`/api/partners/${studentDbId}`);
    if (res.status !== 200) throw new Error(`status ${res.status}`);
  });

  await step("PUT /api/partners/:id", async () => {
    const res = await request(`/api/partners/${partnerId}`, "PUT", { name: "Partner1 Updated" });
    if (res.status !== 200) throw new Error(`status ${res.status}`);
  });

  await step("DELETE /api/partners/:id", async () => {
    const res = await request(`/api/partners/${partnerId}`, "DELETE");
    if (res.status !== 200) throw new Error(`status ${res.status}`);
  });

  // STUDENT SERVICES CRUD
  let serviceId: any = null;
  await step("POST /api/services", async () => {
    const res = await request(`/api/services`, "POST", { student_db_id: studentDbId, service_type: "visa", service_name: "Visa Assist", provider: "ProviderX", status: "open" });
    if (res.status !== 201) throw new Error(`status ${res.status}`);
    serviceId = res.body.id || res.body;
  });

  await step("GET /api/services/:studentDbId", async () => {
    const res = await request(`/api/services/${studentDbId}`);
    if (res.status !== 200) throw new Error(`status ${res.status}`);
  });

  await step("PUT /api/services/:id", async () => {
    const res = await request(`/api/services/${serviceId}`, "PUT", { status: "done" });
    if (res.status !== 200) throw new Error(`status ${res.status}`);
  });

  await step("DELETE /api/services/:id", async () => {
    const res = await request(`/api/services/${serviceId}`, "DELETE");
    if (res.status !== 200) throw new Error(`status ${res.status}`);
  });

  // STATUS update
  await step("POST /api/status-tracking/update", async () => {
    const res = await request(`/api/status-tracking/update`, "POST", { studentDbId, stage: "Application", subStatus: "Submitted", notes: "Test update", changedBy: "tester" });
    if (res.status !== 200) throw new Error(`status ${res.status}`);
  });

  await step("GET /api/status-tracking/student/:studentId", async () => {
    const res = await request(`/api/status-tracking/student/${studentId}`);
    if (res.status !== 200) throw new Error(`status ${res.status}`);
  });

  // Cleanup: delete student
  await step("DELETE /api/students/:id", async () => {
    const res = await request(`/api/students/${studentDbId}`, "DELETE");
    if (res.status !== 200) throw new Error(`status ${res.status}`);
  });

  console.log("\n✅ Targeted API tests finished.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
