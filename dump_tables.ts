import DB from "./src/database";
import fs from "fs";

async function listTables() {
    try {
        const tables = await DB.raw(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
        `);
        
        const tableNames = tables.rows.map((r: any) => r.table_name);
        fs.writeFileSync("tables_list.txt", tableNames.join("\n"));
        console.log("Wrote tables to tables_list.txt");
    } catch (error) {
        console.error("Error listing tables:", error);
    } finally {
        process.exit();
    }
}

listTables();
