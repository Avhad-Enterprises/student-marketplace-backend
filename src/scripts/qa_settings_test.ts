import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('🚀 Starting Settings Module QA Testing...\n');
  
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
      return response.data;
    } catch (error: any) {
      const status = error.response?.status;
      const passed = status === expectedStatus;
      console.log(passed ? '✅ PASSED' : `❌ FAILED (Status: ${status}, Msg: ${error.response?.data?.message || 'Error'})`);
      results.push({ name, passed, status, expected: expectedStatus, error: error.response?.data });
      return null;
    }
  };

  // --- 1. Authentication Testing ---
  await testRequest('Auth - No Token (/api/settings/system)', 'GET', '/api/settings/system', null, 401);

  // --- 2. RBAC Testing (Expected: Students 403, Admin 200) ---
  await testRequest('RBAC - Student accessing System Settings', 'GET', '/api/settings/system', studentAToken, 403);
  await testRequest('RBAC - Student accessing General Settings', 'GET', '/settings/general', studentAToken, 403);
  await testRequest('RBAC - Admin accessing System Settings', 'GET', '/api/settings/system', adminToken, 200);

  // --- 3. Information Disclosure Check ---
  console.log('\nChecking for Sensitive Data Leakage (Admin Access)...');
  const settingsRes = await testRequest('Disclosure - Admin GET System Settings', 'GET', '/api/settings/system', adminToken, 200);
  
  if (settingsRes && settingsRes.data) {
    const data = settingsRes.data;
    const sensitiveKeys = ['stripe_secret_key', 'aws_secret_key', 'smtp_pass', 'aws_access_key', 'db_password'];
    let leaked = [];
    
    for (const key of sensitiveKeys) {
      if (data[key] && data[key] !== '' && !data[key].includes('***') && !data[key].includes('hidden')) {
          leaked.push(key);
      }
    }

    if (leaked.length > 0) {
      console.log(`❌ FAILED: Sensitive keys exposed in plain text: ${leaked.join(', ')}`);
      results.push({ name: 'Leakage - Secrets exposed', passed: false, status: 200, expected: 'Masked/Omitted' });
    } else {
      console.log('✅ PASSED: No sensitive keys found in plain text.');
      results.push({ name: 'Leakage - Secrets exposed', passed: true, status: 200, expected: 'Masked/Omitted' });
    }
  }

  // --- FINAL REPORT ---
  console.log('\n' + '='.repeat(50));
  console.log('SETTINGS MODULE - FINAL QA REPORT');
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
    console.log('\n✅ SECURITY STATUS: SECURE (RBAC Enforced)');
  }
  
  process.exit(0);
}

runTests();
