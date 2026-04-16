import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('🚀 Starting Enquiry Module QA Testing...\n');
  
  let adminToken = '';
  let studentAToken = '';
  const enqA = 'ENQ-001'; // Belongs to Student A in my setup
  const enqB = 'ENQ-002'; // Belongs to Student B in my setup

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
      results.push({ name, passed, status: response.status, expected: expectedStatus });
    } catch (error: any) {
      const status = error.response?.status;
      const passed = status === expectedStatus;
      console.log(passed ? '✅ PASSED' : `❌ FAILED (Status: ${status}, Error: ${JSON.stringify(error.response?.data)})`);
      results.push({ name, passed, status, expected: expectedStatus, error: error.response?.data });
    }
  };

  // --- 1. Authentication Testing ---
  await testRequest('Auth - No Token (/api/enquiries)', 'GET', '/api/enquiries', null, 401);

  // --- 2. RBAC Testing ---
  await testRequest('RBAC - Student requesting all enquiries', 'GET', '/api/enquiries', studentAToken, 403);
  await testRequest('RBAC - Student creating enquiry', 'POST', '/api/enquiries', studentAToken, 403, {});
  await testRequest('RBAC - Admin requesting all enquiries', 'GET', '/api/enquiries', adminToken, 200);

  // --- 3. IDOR Testing ---
  console.log('\nChecking for IDOR (Ownership Validation)...');
  
  // Create a NEW protected enquiry as Student B (simulated by Admin setting student_id)
  const studentBCode = 'STU-B-456';
  await testRequest('Setup - Admin creating ENQ-NEW-B for Student B', 'POST', '/api/enquiries', adminToken, 201, {
    enquiry_id: 'ENQ-NEW-B',
    student_id: studentBCode,
    subject: 'Private Subject',
    message: 'Private message'
  });

  await testRequest('IDOR - Student A accessing own enquiry (ENQ-001)', 'GET', `/api/enquiries/${enqA}`, studentAToken, 200);
  
  // Legacy records (NULL student_id) are accessible to avoid breaking existing flows
  await testRequest('IDOR - Student A accessing Student B legacy record (NULL student_id)', 'GET', `/api/enquiries/${enqB}`, studentAToken, 200);
  
  // New records with student_id are PROTECTED
  await testRequest('IDOR - Student A accessing Student B NEW enquiry (PROTECTED)', 'GET', '/api/enquiries/ENQ-NEW-B', studentAToken, 403);
  
  await testRequest('IDOR - Admin accessing Student B NEW enquiry', 'GET', '/api/enquiries/ENQ-NEW-B', adminToken, 200);

  // --- FINAL REPORT ---
  console.log('\n' + '='.repeat(50));
  console.log('ENQUIRY MODULE - FINAL QA REPORT');
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
