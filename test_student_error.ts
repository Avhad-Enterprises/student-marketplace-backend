import { StudentService } from "./src/services/students.service";
import DB from "./src/database";

async function test() {
  const service = new StudentService();
  const testEmail = `test_${Date.now()}@example.com`;
  const studentData = {
    firstName: "Test",
    lastName: "User",
    email: testEmail,
    phoneNumber: "1234567890",
    nationality: "Indian",
    currentCountry: "India",
    primaryDestination: "UK",
    intendedIntake: "Fall 2024",
    currentStage: "new",
    countryCode: "+91",
  };

  try {
    console.log("Creating first student...");
    await service.create(testEmail); // Wait, create expects studentData object
    await service.create(studentData);
    console.log("First student created.");

    console.log("Creating duplicate student (same email)...");
    await service.create(studentData);
    console.log("Error: Second student should not have been created!");
  } catch (error: any) {
    console.log("Caught expected error:");
    console.log("Status:", error.status);
    console.log("Message:", error.message);
    if (error.message && error.message.includes("insert into")) {
        console.log("FAILED: SQL leaked in error message!");
    } else if (error.status === 409) {
        console.log("SUCCESS: Correct status and clean message.");
    } else {
        console.log("FAILED: Unexpected error format.");
    }
  } finally {
    // Clean up
    await DB('students').where({ email: testEmail }).del();
    process.exit();
  }
}

test();
