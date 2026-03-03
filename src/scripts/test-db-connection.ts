import 'dotenv/config';
import knex from 'knex';

/**
 * Test database connection with AWS RDS
 */
async function testDatabaseConnection() {
  console.log('🔍 Testing Database Connection...\n');

  // Display connection details
  console.log('📋 Connection Details:');
  console.log(`   Host: ${process.env.DB_HOST}`);
  console.log(`   Port: ${process.env.DB_PORT}`);
  console.log(`   Database: ${process.env.DB_DATABASE}`);
  console.log(`   User: ${process.env.DB_USER}\n`);

  try {
    // Create Knex connection
    const db = knex({
      client: 'pg',
      connection: {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      },
      pool: { min: 0, max: 1 },
    });

    // Test raw query
    console.log('⏳ Executing test query...');
    const result = await db.raw('SELECT NOW()');
    console.log('✅ Database connection successful!\n');
    console.log(`   Current database time: ${result.rows[0].now}\n`);

    // Check tables
    console.log('📊 Checking database tables...');
    const tables = await db.raw(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    if (tables.rows.length > 0) {
      console.log(`✅ Found ${tables.rows.length} table(s):\n`);
      tables.rows.forEach((row: any, idx: number) => {
        console.log(`   ${idx + 1}. ${row.table_name}`);
      });
    } else {
      console.log('⚠️  No tables found. Database is empty.\n');
    }

    // Test data from each table
    console.log('\n📈 Testing data retrieval from each table...\n');
    const tableNames = ['students', 'universities', 'countries', 'applications', 'documents', 'payments', 'student_notes', 'activities', 'communications', 'partners', 'status_history', 'student_services'];

    for (const tableName of tableNames) {
      try {
        const count = await db(tableName).count('* as count');
        const recordCount = count[0]?.count || 0;
        console.log(`   ✓ ${tableName}: ${recordCount} record(s)`);
      } catch (err: any) {
        if (err.message.includes('does not exist')) {
          console.log(`   ⚠️  ${tableName}: Table not found`);
        } else {
          console.log(`   ❌ ${tableName}: ${err.message.split('\n')[0]}`);
        }
      }
    }

    await db.destroy();
    console.log('\n✅ All tests completed!\n');
  } catch (error: any) {
    console.error('\n❌ Database connection failed!\n');
    console.error(`Error: ${error.message}\n`);
    if (error.code === 'ECONNREFUSED') {
      console.error('⚠️  Connection refused. Check if:');
      console.error('   - Database host is accessible');
      console.error('   - Database port is correct');
      console.error('   - Firewall allows connection\n');
    }
    process.exit(1);
  }
}

testDatabaseConnection();
