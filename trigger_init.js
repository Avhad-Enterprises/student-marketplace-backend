require('dotenv').config();
require('tsconfig-paths/register');
const { initializeTables } = require('./src/database/tables');

(async () => {
    try {
        console.log("Triggering Database Initialization...");
        await initializeTables();
        console.log("Database Initialization Successful!");
        process.exit(0);
    } catch (error) {
        console.error("Database Initialization Failed:", error);
        process.exit(1);
    }
})();
