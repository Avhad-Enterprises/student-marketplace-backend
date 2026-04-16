import DB from './src/database';

async function dumpUsers() {
  const users = await DB('users').select('id', 'email', 'user_type', 'student_code').limit(5);
  console.log(JSON.stringify(users, null, 2));
  process.exit(0);
}

dumpUsers();
