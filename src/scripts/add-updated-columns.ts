import DB from '@/database';
import 'dotenv/config';

async function run() {
  try {
    console.log('Altering tables to add updated_at if missing...');
    await DB.raw(`ALTER TABLE activities ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`);
    await DB.raw(`ALTER TABLE communications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`);
    console.log('Done.');
    process.exit(0);
  } catch (err) {
    console.error('Failed to alter tables:', err);
    process.exit(1);
  }
}

run();
