import DB from "@/database";
import { logger } from "@/utils/logger";

async function createSimTable() {
    try {
        logger.info("Creating sim_cards table...");
        await DB.raw(`
      CREATE TABLE IF NOT EXISTS sim_cards (
        id SERIAL PRIMARY KEY,
        sim_id VARCHAR(50) UNIQUE,
        provider_name VARCHAR(255) NOT NULL,
        service_name VARCHAR(255) NOT NULL,
        countries_covered INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        student_visible BOOLEAN DEFAULT TRUE,
        network_type VARCHAR(50),
        data_allowance VARCHAR(100),
        validity VARCHAR(100),
        popularity INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        logger.info("sim_cards table created successfully!");
        process.exit(0);
    } catch (err) {
        logger.error("Failed to create sim_cards table:", err);
        process.exit(1);
    }
}

createSimTable();
