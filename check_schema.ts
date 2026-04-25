
import DB from './src/database/index';

async function checkSchema() {
  try {
    const columns = await DB('information_schema.columns')
      .where({ table_name: 'roles' })
      .select('column_name');
    console.log('Roles columns:', columns.map(c => c.column_name));
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkSchema();
