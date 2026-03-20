import DB from "./src/database";

async function truncateAll() {
    try {
        const tables = await DB.raw(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
        `);
        
        const tableNames = tables.rows
            .map((r: any) => r.table_name)
            .filter((name: string) => !['users', 'knex_migrations', 'knex_migrations_lock'].includes(name));

        console.log("Tables found to truncate:", tableNames);

        for (const table of tableNames) {
            await DB.raw(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`);
            console.log(`Cleared table: ${table}`);
        }
        
        console.log("Successfully cleared all data EXCEPT users.");
    } catch (error) {
        console.error("Error clearing DB:", error);
    } finally {
        process.exit();
    }
}
truncateAll();
