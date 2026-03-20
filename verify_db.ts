import DB from "./src/database";
import fs from "fs";

async function verify() {
    try {
        const tables = await DB.raw(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
        `);
        
        const tableNames = tables.rows.map((r: any) => r.table_name);
        let results: string[] = [];

        for (const table of tableNames) {
            const countRes = await DB.raw(`SELECT COUNT(*) FROM "${table}"`);
            const count = countRes.rows[0].count;
            results.push(`${table}: ${count}`);
        }

        fs.writeFileSync("verification_results.txt", results.join("\n"));
        console.log("Verification results written to verification_results.txt");
    } catch (error) {
        console.error("Error during verification:", error);
    } finally {
        process.exit();
    }
}

verify();
