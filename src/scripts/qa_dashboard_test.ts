import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('🚀 Starting Dashboard Module QA Testing...\n');
  
  let adminToken = '';
  let studentAToken = '';
  let studentBToken = '';

  // --- LOGIN PHASE ---
  try {
    console.log('Step 1: Authenticating users...');
    const adminLogin = await axios.post(`${BASE_URL}/login`, { email: 'admin@test.com', password: 'Password123!' });
    adminToken = adminLogin.data.token;
    const studentALogin = await axios.post(`${BASE_URL}/login`, { email: 'student.a@test.com', password: 'Password123!' });
    studentAToken = studentALogin.data.token;
    const studentBLogin = await axios.post(`${BASE_URL}/login`, { email: 'student.b@test.com', password: 'Password123!' });
    studentBToken = studentBLogin.data.token;
    console.log('✅ Users authenticated.\n');
  } catch (error: any) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    process.exit(1);
  }

  const results: any[] = [];
  const testRequest = async (name: string, method: string, url: string, token: string | null, expectedStatus: number) => {
    process.stdout.write(`Testing: ${name}... `);
    try {
      const config: any = {
        method,
        url: `${BASE_URL}${url}`,
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      };
      const response = await axios(config);
      const passed = response.status === expectedStatus;
      console.log(passed ? '✅ PASSED' : `❌ FAILED (Status: ${response.status})`);
      results.push({ name, passed, status: response.status, expected: expectedStatus });
    } catch (error: any) {
      const status = error.response?.status;
      const passed = status === expectedStatus;
      console.log(passed ? '✅ PASSED' : `❌ FAILED (Status: ${status}, Error: ${JSON.stringify(error.response?.data)})`);
      results.push({ name, passed, status, expected: expectedStatus, error: error.response?.data });
    }
  };

  // --- 1. Authentication Testing ---
  await testRequest('Auth - No Token (/api/dashboard/stats)', 'GET', '/api/dashboard/stats', null, 401);

  // --- 2. RBAC Testing (Expected: Students 403, Admin 200) ---
  await testRequest('RBAC - Student accessing /stats', 'GET', '/api/dashboard/stats', studentAToken, 403);
  await testRequest('RBAC - Student accessing /summary', 'GET', '/api/dashboard/summary', studentAToken, 403);
  await testRequest('RBAC - Student accessing /admin-users', 'GET', '/api/dashboard/admin-users', studentAToken, 403);

  await testRequest('RBAC - Admin accessing /stats', 'GET', '/api/dashboard/stats', adminToken, 200);
  await testRequest('RBAC - Admin accessing /summary', 'GET', '/api/dashboard/summary', adminToken, 200);
  await testRequest('RBAC - Admin accessing /alerts', 'GET', '/api/dashboard/alerts', adminToken, 200);
  await testRequest('RBAC - Admin accessing /insights', 'GET', '/api/dashboard/insights', adminToken, 200);
  await testRequest('RBAC - Admin accessing /admin-users', 'GET', '/api/dashboard/admin-users', adminToken, 200);

  // --- 3. Stability Ping ---
  await testRequest('Stability - Ping /ping', 'GET', '/api/dashboard/ping', adminToken, 200);

  // --- FINAL REPORT ---
  console.log('\n' + '='.repeat(50));
  console.log('DASHBOARD MODULE - FINAL QA REPORT');
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
    console.log('\n✅ SECURITY STATUS: SECURE (Admin-Only Enforced)');
  }
  
  process.exit(0);
}

runTests();
