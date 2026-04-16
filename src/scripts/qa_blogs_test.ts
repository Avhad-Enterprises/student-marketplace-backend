import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('🚀 Starting Blogs Module QA Testing...\n');
  
  let adminToken = '';
  let studentAToken = '';
  const pubBlogId = 777771;
  const draftBlogId = 777772;

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
      console.log(passed ? '✅ PASSED' : `❌ FAILED (Status: ${status}, Msg: ${error.response?.data?.message || error.response?.data?.error || 'Error'})`);
      results.push({ name, passed, status, expected: expectedStatus, error: error.response?.data });
      return null;
    }
  };

  // --- 1. Authentication Testing ---
  await testRequest('Auth - No Token (/api/blogs)', 'GET', '/api/blogs', null, 401);

  // --- 2. RBAC Testing (Expected: Students 403, Admin 200/201) ---
  await testRequest('RBAC - Student creating a Blog', 'POST', '/api/blogs', studentAToken, 403, { 
    blog_id: 'BLOG-HACK',
    title: 'Hacked Blog', 
    content: 'Content',
    author: 'Hacker',
    status: 'published'
  });
  
  await testRequest('RBAC - Student deleting a Blog', 'DELETE', `/api/blogs/${pubBlogId}`, studentAToken, 403);
  
  await testRequest('RBAC - Admin creating a Blog', 'POST', '/api/blogs', adminToken, 201, {
    blog_id: 'BLOG-NEW-QA-2',
    title: 'QA Admin Blog',
    content: 'This is a test blog from QA.',
    author: 'Senior QA',
    category: 'Testing',
    status: 'published',
    visibility: 'public'
  });

  // --- 3. Data Leakage / Privacy Testing ---
  console.log('\nChecking for Draft Leakage...');
  const blogList = await testRequest('Leakage - GET All Blogs', 'GET', '/api/blogs', studentAToken, 200);
  
  if (Array.isArray(blogList)) {
    const draftInList = blogList.find((b: any) => b.blog_id === 'BLOG-DRF-001' || b.status === 'draft' || b.id === draftBlogId);
    
    if (draftInList) {
      console.log('❌ FAILED: Student can see draft/private blogs in the list!');
      results.push({ name: 'Leakage - Draft in list', passed: false, status: 200, expected: 'Hidden' });
    } else {
      console.log('✅ PASSED: Draft blogs hidden from list.');
      results.push({ name: 'Leakage - Draft in list', passed: true, status: 200, expected: 'Hidden' });
    }
  }

  // --- FINAL REPORT ---
  console.log('\n' + '='.repeat(50));
  console.log('BLOGS MODULE - FINAL QA REPORT');
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
    console.log('\n✅ SECURITY STATUS: UNSTABLE (Draft Leakage Confirmed)');
  }
  
  process.exit(0);
}

runTests();
