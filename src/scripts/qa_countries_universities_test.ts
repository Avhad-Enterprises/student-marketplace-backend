import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('🚀 Starting Countries & University Module QA Testing...\n');
  
  let adminToken = '';
  let studentAToken = '';
  const countryId = 2;
  const univId = 1;

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
      results.push({ name, passed, status: response.status, expected: expectedStatus, data: response.data });
    } catch (error: any) {
      const status = error.response?.status;
      const passed = status === expectedStatus;
      console.log(passed ? '✅ PASSED' : `❌ FAILED (Status: ${status}, Error: ${JSON.stringify(error.response?.data)})`);
      results.push({ name, passed, status, expected: expectedStatus, error: error.response?.data });
    }
  };

  // --- 1. Authentication Testing ---
  await testRequest('Auth - No Token (/api/countries)', 'GET', '/api/countries', null, 401);
  await testRequest('Auth - No Token (/api/universities)', 'GET', '/api/universities', null, 401);

  // --- 2. RBAC Testing (Expected: Students 403, Admin 200/201) ---
  await testRequest('RBAC - Student exporting countries', 'GET', '/api/countries/export/data', studentAToken, 403);
  await testRequest('RBAC - Student importing universities', 'POST', '/api/universities/import', studentAToken, 403, []);
  
  await testRequest('RBAC - Admin exporting countries', 'GET', '/api/countries/export/data', adminToken, 200);

  // --- 3. Public Data Exposure Testing ---
  await testRequest('Public - GET Country by ID', 'GET', `/api/countries/${countryId}`, studentAToken, 200);
  const countryData = results[results.length - 1].data;
  if (countryData && (countryData.created_by || countryData.updated_by)) {
    console.log('⚠️ ALERT: Country data leaks administrative metadata (created_by/updated_by)!');
    results.push({ name: 'Data Leakage - Country', passed: false });
  } else {
    results.push({ name: 'Data Leakage - Country', passed: true });
  }

  await testRequest('Public - GET University by ID', 'GET', `/api/universities/${univId}`, studentAToken, 200);
  const univData = results[results.length - 1].data;
  if (univData && (univData.created_by || univData.updated_by)) {
    console.log('⚠️ ALERT: University data leaks administrative metadata (created_by/updated_by)!');
    results.push({ name: 'Data Leakage - University', passed: false });
  } else {
    results.push({ name: 'Data Leakage - University', passed: true });
  }

  // --- 4. Stability Check ---
  await testRequest('Stability - Country Metrics', 'GET', '/api/countries/metrics', studentAToken, 200);
  await testRequest('Stability - University Metrics', 'GET', '/api/universities/metrics', studentAToken, 200);

  // --- FINAL REPORT ---
  console.log('\n' + '='.repeat(50));
  console.log('COUNTRIES & UNIVERSITIES - FINAL QA REPORT');
  console.log('='.repeat(50));
  console.log(`Total Cases: ${results.length}`);
  console.log(`Passed: ${results.filter(r => r.passed).length}`);
  console.log(`Failed: ${results.filter(r => !r.passed).length}`);
  console.log('='.repeat(50));
  
  if (results.some(r => !r.passed)) {
    console.log('\n❌ ISSUES DETECTED:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`- [${r.name}] Expected ${r.expected || 'SECURE'}, got ${r.status || 'LEAK'}`);
    });
  } else {
    console.log('\n✅ SECURITY STATUS: SECURE');
  }
  
  process.exit(0);
}

runTests();
