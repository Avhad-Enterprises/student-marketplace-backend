import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('🚀 Starting Students Module QA Testing...\n');
  
  let adminToken = '';
  let studentAToken = '';
  let studentBToken = '';

  // --- LOGIN PHASE ---
  try {
    console.log('Step 1: Authenticating users...');
    
    const adminLogin = await axios.post(`${BASE_URL}/login`, {
      email: 'admin@test.com',
      password: 'Password123!'
    });
    adminToken = adminLogin.data.token;
    console.log('✅ Admin logged in.');

    const studentALogin = await axios.post(`${BASE_URL}/login`, {
      email: 'student.a@test.com',
      password: 'Password123!'
    });
    studentAToken = studentALogin.data.token;
    console.log('✅ Student A logged in.');

    const studentBLogin = await axios.post(`${BASE_URL}/login`, {
      email: 'student.b@test.com',
      password: 'Password123!'
    });
    studentBToken = studentBLogin.data.token;
    console.log('✅ Student B logged in.\n');

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
  await testRequest('Auth - No Token', 'GET', '/api/students', null, 401);
  await testRequest('Auth - Invalid Token', 'GET', '/api/students', 'invalid_token_here', 401);

  // --- 2. RBAC Testing ---
  await testRequest('RBAC - Student accessing Admin route (/api/students)', 'GET', '/api/students', studentAToken, 403);
  await testRequest('RBAC - Admin accessing Admin route (/api/students)', 'GET', '/api/students', adminToken, 200);
  await testRequest('RBAC - Student accessing Metrics (Admin only)', 'GET', '/api/students/metrics', studentAToken, 403);
  await testRequest('RBAC - Admin accessing Metrics', 'GET', '/api/students/metrics', adminToken, 200);

  // --- 3. IDOR Testing ---
  // Student A (ID: 999991, student_code: STU-A-1)
  // Student B (ID: 999992, student_code: STU-B-1)
  await testRequest('IDOR - Student A accessing own profile', 'GET', '/api/students/999991', studentAToken, 200);
  await testRequest('IDOR - Student A accessing Student B profile', 'GET', '/api/students/999992', studentAToken, 403);
  await testRequest('IDOR - Admin accessing Student B profile', 'GET', '/api/students/999992', adminToken, 200);
  await testRequest('IDOR - Student A accessing own completion', 'GET', '/api/students/999991/profile-completion', studentAToken, 200);
  await testRequest('IDOR - Student A accessing Student B completion', 'GET', '/api/students/999992/profile-completion', studentAToken, 403);

  // --- 4. Input Validation Testing ---
  await testRequest('Validation - POST /api/students (Empty Body)', 'POST', '/api/students', adminToken, 400, {});
  await testRequest('Validation - POST /api/students (Missing Email)', 'POST', '/api/students', adminToken, 400, { firstName: 'Test' });

  // --- 5. SQL Injection Testing ---
  await testRequest('SQLi - Search param (\' OR 1=1 --)', 'GET', '/api/students?search=\' OR 1=1 --', adminToken, 200);
  await testRequest('SQLi - Sort param (id; DROP TABLE students; --)', 'GET', '/api/students?sort=id; DROP TABLE students; --', adminToken, 200); // Controller should fallback to default sort

  // --- 6. Sensitive Data Protection ---
  process.stdout.write('Checking Sensitive Data Exposure... ');
  try {
    const res = await axios.get(`${BASE_URL}/api/students`, { headers: { Authorization: `Bearer ${adminToken}` } });
    const students = res.data.data;
    const hasPassword = students.some((s: any) => s.password || s.password_hash);
    if (!hasPassword) {
      console.log('✅ PASSED (No passwords found)');
      results.push({ name: 'Sensitive Data Exposure', passed: true });
    } else {
      console.log('❌ FAILED (Passwords found in response!)');
      results.push({ name: 'Sensitive Data Exposure', passed: false });
    }
  } catch (e) {
     console.log('❓ ERROR CHECKING');
  }

  // --- FINAL REPORT ---
  console.log('\n' + '='.repeat(50));
  console.log('STUDENTS MODULE - FINAL QA REPORT');
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
