import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('🚀 Starting Reports & Analytics Module QA Testing (Corrected Routes)...\n');
  
  let adminToken = '';
  let studentAToken = '';

  // --- LOGIN PHASE ---
  try {
    console.log('Step 1: Authenticating users...');
    const adminLogin = await axios.post(`${BASE_URL}/login`, { email: 'admin@test.com', password: 'Password123!' });
    adminToken = adminLogin.data.token;
    const studentALogin = await axios.post(`${BASE_URL}/login`, { email: 'student.a@test.com', password: 'Password123!' });
    studentAToken = studentALogin.data.token;
    console.log('✅ Users authenticated.\n');
  } catch (error: any) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    process.exit(1);
  }

  const results: any[] = [];
  const testRequest = async (name: string, method: string, url: string, token: string | null, expectedStatus: number, data?: any) => {
    process.stdout.write(`Testing: ${name}... `);
    try {
      const config: any = {
        method,
        url: `${BASE_URL}${url}`,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        data
      };
      const response = await axios(config);
      const passed = response.status === expectedStatus;
      console.log(passed ? '✅ PASSED' : `❌ FAILED (Status: ${response.status})`);
      results.push({ name, passed, status: response.status, expected: expectedStatus, res: response.data });
    } catch (error: any) {
      const status = error.response?.status;
      const passed = status === expectedStatus;
      console.log(passed ? '✅ PASSED' : `❌ FAILED (Status: ${status}, Msg: ${error.response?.data?.message || 'Error'})`);
      results.push({ name, passed, status, expected: expectedStatus, error: error.response?.data });
    }
  };

  // --- 1. Authentication Testing ---
  await testRequest('Auth - No Token (/reports)', 'GET', '/reports', null, 401);

  // --- 2. RBAC Testing (Expected: Students 403, Admin 200) ---
  await testRequest('RBAC - Student accessing /reports/run', 'POST', '/reports/run', studentAToken, 403, { table: 'students' });
  await testRequest('RBAC - Admin accessing /reports/run', 'POST', '/reports/run', adminToken, 200, { table: 'students', dimensions: ['status'] });

  // --- 3. SQL Injection Testing ---
  // Payload 1: Table Injection (Whitelisting check)
  await testRequest('SQLi - Table name injection', 'POST', '/reports/run', adminToken, 400, { table: 'users' });
  
  // Payload 2: Column/Metric Injection (Regex check)
  await testRequest('SQLi - Metric expression injection', 'POST', '/reports/run', adminToken, 400, { 
    table: 'students', 
    metrics: ['COUNT(id); DROP TABLE students; --'] 
  });

  // Payload 3: Operator/Value Injection
  await testRequest('SQLi - Filter operator injection', 'POST', '/reports/run', adminToken, 400, {
    table: 'students',
    filters: [{ field: 'status', operator: 'equals \'val\' OR 1=1', value: 'active' }]
  });

  // Payload 4: Join Table Injection
  await testRequest('SQLi - Join table injection', 'POST', '/reports/run', adminToken, 400, {
    table: 'students',
    joins: [{ table: 'users', on: 'students.id = users.id' }]
  });

  // --- FINAL REPORT ---
  console.log('\n' + '='.repeat(50));
  console.log('REPORTS & ANALYTICS - FINAL QA REPORT');
  console.log('='.repeat(50));
  console.log(`Total Cases: ${results.length}`);
  console.log(`Passed: ${results.filter(r => r.passed).length}`);
  console.log(`Failed: ${results.filter(r => !r.passed).length}`);
  console.log('='.repeat(50));
  
  if (results.some(r => !r.passed)) {
    console.log('\n❌ ISSUES DETECTED:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`- [${r.name}] Expected ${r.expected}, got ${r.status}`);
    });
  } else {
    console.log('\n✅ SECURITY STATUS: SECURE (Whitelisting Effective)');
  }
  
  process.exit(0);
}

runTests();
