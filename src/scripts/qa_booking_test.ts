import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('🚀 Starting Booking Module QA Testing...\n');
  
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
      results.push({ name, passed, status: response.status, expected: expectedStatus });
    } catch (error: any) {
      const status = error.response?.status;
      const passed = status === expectedStatus;
      console.log(passed ? '✅ PASSED' : `❌ FAILED (Status: ${status}, Error: ${JSON.stringify(error.response?.data)})`);
      results.push({ name, passed, status, expected: expectedStatus, error: error.response?.data });
    }
  };

  // --- 1. Authentication Testing ---
  await testRequest('Auth - No Token', 'GET', '/api/bookings', null, 401);

  // --- 2. RBAC Testing (Expected: All Student calls 403, Admin 200) ---
  await testRequest('RBAC - Student accessing Bookings List', 'GET', '/api/bookings', studentAToken, 403);
  await testRequest('RBAC - Student accessing Booking by ID', 'GET', '/api/bookings/BK-TEST-001', studentAToken, 403);
  await testRequest('RBAC - Student creating Booking', 'POST', '/api/bookings', studentAToken, 403, { 
    booking_id: 'BK-NEW-1', 
    student_name: 'Test', 
    service: 'Test', 
    expert: 'Test', 
    date_time: '2025-12-12T12:00:00Z', 
    status: 'upcoming', 
    mode: 'online', 
    source: 'web' 
  });

  await testRequest('RBAC - Admin accessing Bookings List', 'GET', '/api/bookings', adminToken, 200);
  await testRequest('RBAC - Admin accessing Booking by ID', 'GET', '/api/bookings/BK-TEST-001', adminToken, 200);

  // --- 3. Input Validation Testing ---
  await testRequest('Validation - Admin POST /api/bookings (Empty Body)', 'POST', '/api/bookings', adminToken, 400, {});

  // --- FINAL REPORT ---
  console.log('\n' + '='.repeat(50));
  console.log('BOOKING MODULE - FINAL QA REPORT');
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
    console.log('\n✅ SECURITY STATUS: SECURE (Current Admin-Only Enforced)');
  }
  
  process.exit(0);
}

runTests();
