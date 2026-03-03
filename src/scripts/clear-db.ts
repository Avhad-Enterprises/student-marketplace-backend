import DB from "@/database";
import { logger } from "@/utils/logger";

/**
 * Clear all data from tables while keeping table structure
 */
async function clearDatabase() {
  try {
    logger.info("Connected to database to clear data...");

    const tables = [
      "student_notes",
      "payments",
      "student_services",
      "documents",
      "status_history",
      "applications",
      "students",
      "universities",
      "countries",
    ];

    for (const table of tables) {
      try {
        await DB.raw(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`);
        logger.info(`Cleared table: ${table}`);
      } catch (err: any) {
        if (err.code === "42P01") {
          // Table does not exist
          logger.warn(`Table ${table} does not exist`);
        } else {
          logger.error(`Error clearing table ${table}:`, err);
        }
      }
    }

    logger.info("Successfully cleared all data.");
    process.exit(0);
  } catch (err) {
    logger.error("Database error:", err);
    process.exit(1);
  }
}

clearDatabase();
