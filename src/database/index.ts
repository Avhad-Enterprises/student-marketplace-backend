import knex from "knex";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
    client: "pg",
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port: Number(process.env.DB_PORT) || 5432,
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    },
    searchPath: ["public"], // Enforce array for searchPath if needed by newer knex versions, or string matching source
};

const DB = knex(dbConfig);

export default DB;

// Placeholder for Table Names to be added as features are developed
export const T = {
    // USERS_TABLE: 'users',
    // ...
};
