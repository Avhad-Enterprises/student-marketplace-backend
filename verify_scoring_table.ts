import DB from "./src/database";

async function check() {
    try {
        const exists = await DB.schema.hasTable("ai_test_scoring_settings");
        console.log("ai_test_scoring_settings table exists:", exists);
        if (exists) {
            const columns = await DB("ai_test_scoring_settings").columnInfo();
            console.log("Columns:", Object.keys(columns));
            const count = await DB("ai_test_scoring_settings").count("*");
            console.log("Row count:", count[0].count);
        } else {
            console.log("ai_test_scoring_settings table DOES NOT EXIST");
        }
    } catch (error) {
        console.error("Error checking DB:", error);
    } finally {
        process.exit();
    }
}
check();
