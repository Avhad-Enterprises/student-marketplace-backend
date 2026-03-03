import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function testConnection() {
    console.log('Testing connection to:', process.env.DB_HOST);
    console.log('User:', process.env.DB_USER);

    const client = new Client({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'postgres',
        ssl: { rejectUnauthorized: false },
    });

    try {
        await client.connect();
        console.log('SUCCESS: Connected to RDS (postgres db)');
    } catch (err) {
        console.error('FAILURE:', err.message);
    } finally {
        await client.end();
    }
}

testConnection();
