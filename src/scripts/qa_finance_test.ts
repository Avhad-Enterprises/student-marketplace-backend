import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('🚀 Starting Finance Module QA Testing...\n');
  
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
      results.push({ name, passed, status: response.status, expected: expectedStatus, data: response.data });
    } catch (error: any) {
      const status = error.response?.status;
      const passed = status === expectedStatus;
      console.log(passed ? '✅ PASSED' : `❌ FAILED (Status: ${status}, Error: ${JSON.stringify(error.response?.data)})`);
      results.push({ name, passed, status, expected: expectedStatus, error: error.response?.data });
    }
  };

  // --- 1. Authentication Testing ---
  await testRequest('Auth - No Token (/api/banks)', 'GET', '/api/banks', null, 401);

  // --- 2. RBAC Testing ---
  await testRequest('RBAC - Student creating a Loan', 'POST', '/api/loans', studentAToken, 403, { 
    loan_id: 'LON-NEW-1', 
    provider_name: 'New Provider', 
    product_name: 'Product' 
  });
  
  await testRequest('RBAC - Admin creating a Loan', 'POST', '/api/loans', adminToken, 201, { 
    loan_id: 'LON-TEST-BRK', 
    provider_name: 'QA Provider', 
    product_name: 'QA Product',
    amount_range: '1000-5000',
    countries_supported: 'Global',
    status: 'active'
  });

  // --- 3. Stability & Data Exposure Testing ---
  await testRequest('Stability - GET Banks', 'GET', '/api/banks', studentAToken, 200);
  await testRequest('Stability - GET Loans', 'GET', '/api/loans', studentAToken, 200);

  // --- FINAL REPORT ---
  console.log('\n' + '='.repeat(50));
  console.log('FINANCE MODULE - FINAL QA REPORT');
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
    console.log('\n✅ SECURITY STATUS: SECURE');
  }
  
  process.exit(0);
}

runTests();
