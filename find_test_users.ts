import DB from './src/database';

async function findTestUsers() {
  const admin = await DB('users').where('user_type', 'admin').select('email', 'id', 'student_code').first();
  const students = await DB('users').where('user_type', 'student').select('email', 'id', 'student_code').limit(2);
  
  console.log("Admin:", JSON.stringify(admin, null, 2));
  console.log("Students:", JSON.stringify(students, null, 2));
  process.exit(0);
}

findTestUsers();
