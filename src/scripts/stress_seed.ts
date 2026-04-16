import DB from "@/database";
import { Tables } from "@/database/tables";
import { logger } from "@/utils/logger";
import { v4 as uuidv4 } from 'uuid';

/**
 * Seeding script for stress testing the dashboard
 * Inserts 10,000+ records with distributed created_at dates
 */
async function stressSeed() {
  try {
    logger.info("🚀 Starting Production-Level Stress Seeding (11,000 Total Records)...");

    const now = new Date();
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const getRandomDate = () => {
      const start = sixtyDaysAgo.getTime();
      const end = now.getTime();
      return new Date(start + Math.random() * (end - start));
    };

    const statuses = ['pending', 'approved', 'rejected', 'in-review', 'deferred'];
    const blogStatuses = ['published', 'draft', 'archived'];

    // 1. Seed Students (3,000)
    logger.info("Seeding 3,000 Students...");
    const studentIds: number[] = [];
    for (let i = 0; i < 30; i++) { // 30 chunks of 100
      const chunk = [];
      for (let j = 0; j < 100; j++) {
        chunk.push({
          student_id: `STU-${uuidv4().slice(0, 8)}`,
          first_name: `FirstName${i*100 + j}`,
          last_name: `LastName${i*100 + j}`,
          email: `student${i*100 + j}@stress-test.com`,
          created_at: getRandomDate()
        });
      }
      const ids = await DB(Tables.STUDENTS).insert(chunk).returning('id');
      studentIds.push(...ids.map(r => r.id));
    }

    // 2. Seed Applications (3,000)
    logger.info("Seeding 3,000 Applications...");
    for (let i = 0; i < 30; i++) {
        const chunk = [];
        for (let j = 0; j < 100; j++) {
          chunk.push({
            application_id: `APP-${uuidv4().slice(0, 8)}`,
            student_db_id: studentIds[Math.floor(Math.random() * studentIds.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            created_at: getRandomDate()
          });
        }
        await DB(Tables.APPLICATIONS).insert(chunk);
    }

    // 3. Seed Payments (2,000)
    logger.info("Seeding 2,000 Payments...");
    for (let i = 0; i < 20; i++) {
        const chunk = [];
        for (let j = 0; j < 100; j++) {
          chunk.push({
            payment_id: `PAY-${uuidv4().slice(0, 8)}`,
            student_db_id: studentIds[Math.floor(Math.random() * studentIds.length)],
            amount: parseFloat((Math.random() * 5000 + 100).toFixed(2)),
            currency: 'USD',
            status: 'paid',
            invoice_number: `INV-${uuidv4().slice(0, 8)}`,
            created_at: getRandomDate()
          });
        }
        await DB(Tables.PAYMENTS).insert(chunk);
    }

    // 4. Seed Blogs (1,000)
    logger.info("Seeding 1,000 Blogs...");
    for (let i = 0; i < 10; i++) {
        const chunk = [];
        for (let j = 0; j < 100; j++) {
          chunk.push({
            blog_id: `BLOG-${uuidv4().slice(0, 8)}`,
            title: `How to study in Canada - Chapter ${i*100 + j}`,
            status: blogStatuses[Math.floor(Math.random() * blogStatuses.length)],
            author: 'Stress Tester AI',
            created_at: getRandomDate()
          });
        }
        await DB(Tables.BLOGS).insert(chunk);
    }

    // 5. Seed Users (2,000) - Increased from 1k for better user distribution
    logger.info("Seeding 2,000 Users...");
    for (let i = 0; i < 20; i++) {
        const chunk = [];
        for (let j = 0; j < 100; j++) {
          chunk.push({
            full_name: `AdminUser ${i*100 + j}`,
            email: `admin${i*100 + j}@stress-test.com`,
            user_type: 'admin',
            account_status: true,
            created_at: getRandomDate()
          });
        }
        await DB('users').insert(chunk);
    }

    logger.info("✨ Stress Seeding Completed Successfully! (11,000 Total Records Added)");
    process.exit(0);
  } catch (error) {
    logger.error("❌ Stress Seeding Failed:", error);
    process.exit(1);
  }
}

stressSeed();
