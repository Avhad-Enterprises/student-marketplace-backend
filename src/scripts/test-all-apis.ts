import http from "http";
import 'dotenv/config';

/**
 * Make HTTP request to test endpoints
 */
function request(
  path: string,
  method: string = "GET",
  data: any = null,
  token: string | null = null
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
 * Run API health checks for all 12 domains
 */
async function testAllAPIs() {
  console.log("🧪 Testing All API Endpoints with Database\n");
  console.log("📌 Note: All endpoints use /api prefix\n");

  const endpoints = [
    { method: "GET", path: "/api/students", description: "Get all students" },
    { method: "GET", path: "/api/universities", description: "Get all universities" },
    { method: "GET", path: "/api/countries", description: "Get all countries" },
    { method: "GET", path: "/api/applications", description: "Get all applications" },
    // per-student endpoints (placeholders will be filled after fetching a student)
    { method: "GET", path: "/api/documents/:studentDbId", description: "Get documents for student" },
    { method: "GET", path: "/api/payments/:studentDbId", description: "Get payments for student" },
    { method: "GET", path: "/api/notes/:studentDbId", description: "Get notes for student" },
    { method: "GET", path: "/api/activities/:student_id", description: "Get activities for student" },
    { method: "GET", path: "/api/communications/:student_id", description: "Get communications for student" },
    { method: "GET", path: "/api/partners/:student_id", description: "Get partners for student" },
    { method: "GET", path: "/api/services/:studentDbId", description: "Get student services for student" },
    { method: "GET", path: "/api/status-tracking/all", description: "Get status tracking (all)" },
  ];

  console.log("🌐 Testing Endpoints:\n");

  // get a sample student to test per-student endpoints
  let sampleStudent: any = null;
  try {
    const studentsResp = await request("/api/students");
    if (studentsResp.status >= 200 && studentsResp.status < 300) {
      if (Array.isArray(studentsResp.body?.data) && studentsResp.body.data.length > 0) sampleStudent = studentsResp.body.data[0];
      else if (Array.isArray(studentsResp.body) && studentsResp.body.length > 0) sampleStudent = studentsResp.body[0];
    }
  } catch (e) {
    // ignore - we'll continue and mark per-student endpoints as skipped if no sample
  }

  const results: any[] = [];

  for (const endpoint of endpoints) {
    // if endpoints require a student id, replace placeholder with actual sample id
    let path = endpoint.path;
    if ((path.includes(":studentDbId") || path.includes(":student_id")) && sampleStudent) {
      path = path.replace(":studentDbId", String(sampleStudent.id)).replace(":student_id", String(sampleStudent.id));
    }
    try {
      let responseUsed: any;
      if (endpoint.path.includes(":studentDbId") || endpoint.path.includes(":student_id")) {
        if (!sampleStudent) {
          // skip per-student endpoint if no sample student
          results.push({ path: endpoint.path, status: "SKIP", description: endpoint.description, dataCount: 0 });
          console.log(`⚠️ Skipping ${endpoint.path} - no sample student available\n`);
          continue;
        }
        responseUsed = await request(path, endpoint.method);
      } else {
        responseUsed = await request(endpoint.path, endpoint.method);
      }
      const status = responseUsed.status;
      const isSuccess = status >= 200 && status < 300;
      const icon = isSuccess ? "✅" : "⚠️";
      const dataCount = Array.isArray(responseUsed.body?.data) ? responseUsed.body.data.length : (Array.isArray(responseUsed.body) ? responseUsed.body.length : 0);

      results.push({ path: path, status: status, description: endpoint.description, dataCount: dataCount });

      console.log(`${icon} ${path}`);
      console.log(`   Status: ${status} | Records: ${dataCount}`);
      console.log(`   ${endpoint.description}\n`);
    } catch (error: any) {
      results.push({
        path: endpoint.path,
        status: "ERROR",
        description: endpoint.description,
        error: error.message,
      });

      console.log(`❌ ${endpoint.path}`);
      console.log(`   Error: ${error.message}\n`);
    }
  }

  // Summary
  const successCount = results.filter((r) => typeof r.status === "number" && r.status < 300).length;
  const totalCount = results.length;

  console.log("📊 Test Summary:\n");
  console.log(`✅ Successful: ${successCount}/${totalCount}`);
  console.log(`📈 Total records across all endpoints: ${results.reduce((sum, r) => sum + (r.dataCount || 0), 0)}\n`);

  // Detailed results
  console.log("📋 Detailed Results:\n");
  results.forEach((result) => {
    const status = typeof result.status === "number" ? `${result.status}` : result.status;
    console.log(`${result.path.padEnd(45)} | Status: ${status.padEnd(5)} | Records: ${result.dataCount || 0}`);
  });

  console.log("\n✅ All API tests completed!\n");
}

testAllAPIs().catch(console.error);
