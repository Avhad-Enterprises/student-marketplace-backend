import DB from './src/database';

async function listRoles() {
  const roles = await DB('roles').select('id', 'name');
  console.log(JSON.stringify(roles, null, 2));
  process.exit(0);
}

listRoles();
