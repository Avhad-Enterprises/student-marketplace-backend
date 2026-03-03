import DB from "@/database";
import { logger } from "@/utils/logger";

/**
 * Drop all tables and reset database
 * WARNING: This will delete all data
 */
async function dropTables() {
  try {
    logger.info("Dropping all tables...");

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
      "knex_migrations",
      "knex_migrations_lock",
    ];

    for (const table of tables) {
      try {
        logger.info(`Dropping table ${table}...`);
        await DB.raw(`DROP TABLE IF EXISTS "${table}" CASCADE`);
      } catch (err: any) {
        logger.error(`Error dropping table ${table}:`, err);
      }
    }

    logger.info("All tables dropped successfully.");
    process.exit(0);
  } catch (err) {
    logger.error("Error dropping tables:", err);
    process.exit(1);
  }
}

dropTables();
