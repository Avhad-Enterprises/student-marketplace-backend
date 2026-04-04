import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function createDatabase() {
    const client = new Client({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'postgres', // Connect to default postgres db
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    });

    try {
        await client.connect();
        console.log('Connected to RDS (postgres db)');

        const dbName = process.env.DB_DATABASE || 'StudenMarketPlace';
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);

        if (process.env.DROP_DATABASE === 'true' && (res.rowCount || 0) > 0) {
            console.log(`Dropping database ${dbName}...`);
            await client.query(`DROP DATABASE "${dbName}"`);
            console.log(`Database ${dbName} dropped.`);
            (res as any).rowCount = 0; // Force creation logic below
        }

        if ((res.rowCount || 0) === 0) {
            console.log(`Creating database ${dbName}...`);
            // CREATE DATABASE cannot be run in a transaction, and Client.query usually runs in one if not careful
            // But simple client.query(CREATE DATABASE) works if no TRANSACTION is started.
            await client.query(`CREATE DATABASE "${dbName}"`);
            console.log(`Database ${dbName} created successfully.`);
        } else {
            console.log(`Database ${dbName} already exists.`);
        }
    } catch (err) {
        console.error('Error creating database:', (err as any).message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

createDatabase();
