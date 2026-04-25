
import DB from './src/database/index';

async function checkUser() {
  try {
    const user = await DB('users').where({ email: 'admin@example.com' }).first();
    console.log('User found:', JSON.stringify(user, null, 2));
    const role = await DB('roles').where({ id: user.role_id }).first();
    console.log('Role found:', JSON.stringify(role, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkUser();
