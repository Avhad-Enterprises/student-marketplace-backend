import http from "http";

/**
 * Make HTTP request to test endpoints
 */
function request(
  path: string,
  method: string = "GET",
  data: any = null
): Promise<{ status: number; body: any }> {
  return new Promise((resolve, reject) => {
    const port = process.env.PORT || 5000;
    const options = {
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
      (options.headers as any)["Content-Length"] = Buffer.byteLength(jsonData);
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

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

/**
 * Run API health checks and basic tests
 */
async function runHealthCheck() {
  try {
    console.log("🏥 Starting API Health Check...\n");

    // Test 1: Health endpoint
    console.log("1️⃣  Testing /api/health...");
    const health = await request("/api/health");
    console.log(`   Status: ${health.status}`);
    console.log(`   Response: ${JSON.stringify(health.body, null, 2)}\n`);

    // Test 2: Get students
    console.log("2️⃣  Fetching students...");
    const students = await request("/api/students");
    console.log(`   Status: ${students.status}`);
    console.log(`   Total students: ${students.body.pagination?.total || 0}\n`);

    // Test 3: Get countries
    console.log("3️⃣  Fetching countries...");
    const countries = await request("/api/countries");
    console.log(`   Status: ${countries.status}`);
    console.log(`   Total countries: ${countries.body.pagination?.total || 0}\n`);

    // Test 4: Get universities
    console.log("4️⃣  Fetching universities...");
    const universities = await request("/api/universities");
    console.log(`   Status: ${universities.status}`);
    console.log(`   Total universities: ${universities.body.pagination?.total || 0}\n`);

    // Test 5: Get metrics
    console.log("5️⃣  Fetching student metrics...");
    const metrics = await request("/api/students/metrics");
    console.log(`   Status: ${metrics.status}`);
    console.log(`   Metrics: ${JSON.stringify(metrics.body, null, 2)}\n`);

    console.log("✅ Health check completed successfully!\n");
  } catch (err) {
    console.error("❌ Health check failed:", err);
    process.exit(1);
  }
}

runHealthCheck();
