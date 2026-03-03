import DB from "@/database";
import { logger } from "@/utils/logger";

/**
 * Seed database with test data
 */
async function seedData() {
  try {
    logger.info("Seeding database with test data...");

    // Seed countries
    const countryData = [
      {
        name: "Canada",
        code: "CA",
        region: "North America",
        visa_difficulty: "Low",
        cost_of_living: "High",
        work_rights: true,
        pr_availability: true,
        status: "active",
        popularity: 90,
      },
      {
        name: "United States",
        code: "US",
        region: "North America",
        visa_difficulty: "Medium",
        cost_of_living: "High",
        work_rights: true,
        pr_availability: true,
        status: "active",
        popularity: 95,
      },
      {
        name: "United Kingdom",
        code: "UK",
        region: "Europe",
        visa_difficulty: "Medium",
        cost_of_living: "Very High",
        work_rights: true,
        pr_availability: false,
        status: "active",
        popularity: 85,
      },
      {
        name: "Australia",
        code: "AU",
        region: "Oceania",
        visa_difficulty: "Medium",
        cost_of_living: "High",
        work_rights: true,
        pr_availability: true,
        status: "active",
        popularity: 80,
      },
    ];

    for (const country of countryData) {
      await DB.raw(
        `INSERT INTO countries (name, code, region, visa_difficulty, cost_of_living, work_rights, pr_availability, status, popularity)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (name) DO NOTHING`,
        [
          country.name,
          country.code,
          country.region,
          country.visa_difficulty,
          country.cost_of_living,
          country.work_rights,
          country.pr_availability,
          country.status,
          country.popularity,
        ]
      );
    }
    logger.info("Seeded countries");

    // Seed universities
    const studentData = [
      {
        firstName: "John",
        lastName: "Doe",
        email: `john.doe.${Date.now()}@example.com`,
        dateOfBirth: "2000-01-15",
        countryCode: "CA",
        phoneNumber: "+1234567890",
        nationality: "Canadian",
        currentCountry: "Canada",
        primaryDestination: "USA",
        intendedIntake: "Fall 2025",
        currentStage: "profile-creation",
        assignedCounselor: "Jane Smith",
        riskLevel: "low",
        leadSource: "organic",
        campaign: "summer-2025",
        countryPreferences: ["USA", "Canada"],
        notes: "High performer",
        accountStatus: true,
      },
      {
        firstName: "Jane",
        lastName: "Smith",
        email: `jane.smith.${Date.now()}@example.com`,
        dateOfBirth: "2001-05-20",
        countryCode: "US",
        phoneNumber: "+1987654321",
        nationality: "American",
        currentCountry: "USA",
        primaryDestination: "Canada",
        intendedIntake: "Winter 2026",
        currentStage: "profile-complete",
        assignedCounselor: "John Brown",
        riskLevel: "low",
        leadSource: "referral",
        campaign: "winter-2026",
        countryPreferences: ["Canada", "UK"],
        notes: "Excellent academic record",
        accountStatus: true,
      },
    ];

    for (const student of studentData) {
      const studentId = `STU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      await DB.raw(
        `INSERT INTO students (student_id, first_name, last_name, email, date_of_birth, country_code, phone_number, 
         nationality, current_country, primary_destination, intended_intake, current_stage, assigned_counselor, 
         risk_level, lead_source, campaign, country_preferences, notes, account_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
        [
          studentId,
          student.firstName,
          student.lastName,
          student.email,
          student.dateOfBirth,
          student.countryCode,
          student.phoneNumber,
          student.nationality,
          student.currentCountry,
          student.primaryDestination,
          student.intendedIntake,
          student.currentStage,
          student.assignedCounselor,
          student.riskLevel,
          student.leadSource,
          student.campaign,
          JSON.stringify(student.countryPreferences),
          student.notes,
          student.accountStatus,
        ]
      );
    }
    logger.info("Seeded students");

    logger.info("Database seeded successfully!");
    process.exit(0);
  } catch (err) {
    logger.error("Error seeding database:", err);
    process.exit(1);
  }
}

seedData();
