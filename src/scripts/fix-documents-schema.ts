import 'dotenv/config';
import DB from '../database';
import { logger } from '../utils/logger';

async function fixDocumentsSchema() {
  console.log('--- Fixing Documents Table Schema ---');
  
  try {
    // Check if table exists
    const hasTable = await DB.schema.hasTable('documents');
    if (!hasTable) {
      console.log('Documents table does not exist. Creating it with proper constraints...');
      await DB.raw(`
        CREATE TABLE documents (
          id SERIAL PRIMARY KEY,
          student_db_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
          name VARCHAR(255) NOT NULL,
          category VARCHAR(100),
          status VARCHAR(50) DEFAULT 'active',
          file_type VARCHAR(255),
          file_size BIGINT,
          uploaded_by VARCHAR(255),
          file_url TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('Table "documents" created successfully.');
    } else {
      console.log('Documents table exists. Altering column types...');
      await DB.raw(\`
        ALTER TABLE documents ALTER COLUMN file_type TYPE VARCHAR(255);
        ALTER TABLE documents ALTER COLUMN file_url TYPE TEXT;
        ALTER TABLE documents ALTER COLUMN name TYPE VARCHAR(255);
        ALTER TABLE documents ALTER COLUMN uploaded_by TYPE VARCHAR(255);
        ALTER TABLE documents ALTER COLUMN category TYPE VARCHAR(100);
      \`);
      console.log('Table "documents" columns updated successfully.');
    }
    
    console.log('\n--- SCHEMA FIX SUCCESSFUL ---');
  } catch (error: any) {
    console.error('\nSchema Fix Failed:', error.message);
    if (error.stack) console.error(error.stack);
  } finally {
    await DB.destroy();
  }
}

fixDocumentsSchema();
