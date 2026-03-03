import DB from "./src/database";

async function check() {
    try {
        const exists = await DB.schema.hasTable("countries");
        console.log("Countries table exists:", exists);
        if (exists) {
            const columns = await DB("countries").columnInfo();
            console.log("Columns:", Object.keys(columns));
        } else {
            console.log("Countries table DOES NOT EXIST");
        }
    } catch (error) {
        console.error("Error checking DB:", error);
    } finally {
        process.exit();
    }
}
check();
