import DB from "./src/database";

async function listTables() {
    try {
        const tables = await DB.raw(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
        `);
        
        const tableNames = tables.rows.map((r: any) => r.table_name);
        console.log("Existing tables in database:");
        console.log(JSON.stringify(tableNames, null, 2));
    } catch (error) {
        console.error("Error listing tables:", error);
    } finally {
        process.exit();
    }
}

listTables();
