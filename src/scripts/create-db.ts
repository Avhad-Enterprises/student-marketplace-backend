import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

async function createDatabase() {
    const targetDb = process.env.DB_DATABASE || 'student_marketplace';

    // Connect to the default 'postgres' database first to create the target database
    const config = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT) || 5432,
        database: 'postgres', // Always connect to 'postgres' to run CREATE DATABASE
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    };

    const client = new Client(config);

    try {
        console.log(`🔌 Connecting to RDS (postgres) to check for database: ${targetDb}...`);
        await client.connect();

        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${targetDb}'`);

        if (res.rowCount === 0) {
            console.log(`🏗️ Database "${targetDb}" does not exist. Creating...`);
            // CREATE DATABASE cannot be run inside a transaction block
            await client.query(`CREATE DATABASE "${targetDb}"`);
            console.log(`✅ Database "${targetDb}" created successfully!`);
        } else {
            console.log(`✨ Database "${targetDb}" already exists.`);
        }
    } catch (error) {
        console.error('❌ Error creating database:', error);
        process.exit(1);
    } finally {
        await client.end();
    }
}

createDatabase();
