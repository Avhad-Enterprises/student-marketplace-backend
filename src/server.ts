import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
// console.log("!!! SERVER.TS STARTED !!!"); // Removing debug log
import App from "./app";
import validateEnv from "./utils/validateEnv";
import { initializeTables } from "./database/tables";

// Routes
import AuthRoute from "./routes/auth.route";
import { StudentRoute } from "./routes/students.route";
import { UniversityRoute } from "./routes/universities.route";
import { ApplicationRoute } from "./routes/applications.route";
import { CountryRoute } from "./routes/countries.route";
import { StatusTrackingRoute } from "./routes/statusTracking.route";
import { DocumentRoute } from "./routes/documents.route";
import { StudentServicesRoute } from "./routes/studentServices.route";
import { PaymentRoute } from "./routes/payments.route";
import { NoteRoute } from "./routes/notes.route";
import { ActivityRoute } from "./routes/activities.route";
import { CommunicationRoute } from "./routes/communications.route";
import { PartnerRoute } from "./routes/partners.route";
import { SimCardRoute } from "./routes/simCards.route";
import { BankRoute } from "./routes/banks.route";
import { InsuranceRoute } from "./routes/insurance.route";
import { VisaRoute } from "./routes/visa.route";
import { TaxesRoute } from "./routes/taxes.route";
import { LoansRoute } from "./routes/loans.route";
import { BuildCreditRoute } from "./routes/buildCredit.route";
import { HousingRoute } from "./routes/housing.route";
import { ForexRoute } from "./routes/forex.route";
import { EmploymentRoute } from "./routes/employment.route";
import { FoodRoute } from "./routes/food.route";
import { CourseRoute } from "./routes/course.route";
import { AiAssistantRoute } from "./routes/aiAssistant.route";
import { AiFeatureRoute } from "./routes/aiFeature.route";
import { BookingRoute } from "./routes/booking.route";
import { EnquiryRoute } from "./routes/enquiry.route";
import { ExpertRoute } from "./routes/experts.route";
import { BlogRoute } from "./routes/blogs.route";
import RoleRoute from "./routes/role.route";
import UserRoute from "./routes/users.route";
import SystemSettingsRoute from "./routes/systemSettings.route";
import ServiceCountrySettingsRoute from "./routes/serviceCountrySettings.route";
import ComparisonRulesRoute from "./routes/comparisonRules.route";
import SopAssistantRoute from "./routes/sopAssistant.route";
import { LibraryItemRoute } from "./routes/libraryItem.route";
import { AiTestPlansRoute } from "./routes/aiTestPlans.route";
import { AiTestReportRoute } from "./routes/aiTestReport.route";
import { AiTestScoringRoute } from "./routes/aiTestScoring.route";
import { AiVisaSettingsRoute } from "./routes/aiVisaSettings.route";
import { CommunicationSettingsRoute } from "./routes/communicationSettings.route";
import { MessageTemplateRoute } from "./routes/messageTemplate.route";
import { DeliverySafetySettingsRoute } from "./routes/deliverySafetySettings.route";
import AdminNotificationSettingsRoute from "./routes/adminNotificationSettings.route";
import ComplianceSettingsRoute from "./routes/complianceSettings.route";
import FinanceSettingsRoute from "./routes/financeSettings.route";
import LocalizationSettingsRoute from "./routes/localizationSettings.route";
import IntegrationSettingsRoute from "./routes/integrationSettings.route";
import FileSettingsRoute from "./routes/fileSettings.route";
import PolicySettingsRoute from "./routes/policySettings.route";
import GeneralSettingsRoute from "./routes/generalSettings.route";
import { HealthRoute } from "./routes/health.route";
import DashboardRoute from "./routes/dashboard.route";

validateEnv();

const app = new App([
  new HealthRoute(),
  new UserRoute(),
  new RoleRoute(),
  new AuthRoute(),
  new StudentRoute(),
  new UniversityRoute(),
  new ApplicationRoute(),
  new CountryRoute(),
  new StatusTrackingRoute(),
  new DocumentRoute(),
  new StudentServicesRoute(),
  new PaymentRoute(),
  new NoteRoute(),
  new ActivityRoute(),
  new CommunicationRoute(),
  new PartnerRoute(),
  new SimCardRoute(),
  new BankRoute(),
  new InsuranceRoute(),
  new VisaRoute(),
  new TaxesRoute(),
  new LoansRoute(),
  new BuildCreditRoute(),
  new HousingRoute(),
  new ForexRoute(),
  new EmploymentRoute(),
  new FoodRoute(),
  new CourseRoute(),
  new AiAssistantRoute(),
  new AiFeatureRoute(),
  new BookingRoute(),
  new EnquiryRoute(),
  new ExpertRoute(),
  new BlogRoute(),
  new SystemSettingsRoute(),
  new ServiceCountrySettingsRoute(),
  new ComparisonRulesRoute(),
  new SopAssistantRoute(),
  new LibraryItemRoute(),
  new AiTestPlansRoute(),
  new AiTestReportRoute(),
  new AiTestScoringRoute(),
  new AiVisaSettingsRoute(),
  new CommunicationSettingsRoute(),
  new MessageTemplateRoute(),
  new DeliverySafetySettingsRoute(),
  new AdminNotificationSettingsRoute(),
  new ComplianceSettingsRoute(),
  new FinanceSettingsRoute(),
  new LocalizationSettingsRoute(),
  new IntegrationSettingsRoute(),
  new FileSettingsRoute(),
  new PolicySettingsRoute(),
  new GeneralSettingsRoute(),
  new DashboardRoute(),
]);

// const startServer = async () => {
//     try {
//         await initializeTables();
//         app.listen();
//     } catch (error) {
//         console.error('Failed to start server:', error);
//         process.exit(1);
//     }
// };

const startServer = async () => {
  try {
    await initializeTables();
    app.listen();
  } catch (error) {
    console.error("Startup error:", error);
    throw error;
  }
};

startServer();
