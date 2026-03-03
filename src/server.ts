import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });
// console.log("!!! SERVER.TS STARTED !!!"); // Removing debug log
import App from './app';
import validateEnv from './utils/validateEnv';
import { initializeTables } from './database/tables';

// Routes
import AuthRoute from './routes/auth.route';
import { StudentRoute } from './routes/students.route';
import { UniversityRoute } from './routes/universities.route';
import { ApplicationRoute } from './routes/applications.route';
import { CountryRoute } from './routes/countries.route';
import { StatusTrackingRoute } from './routes/statusTracking.route';
import { DocumentRoute } from './routes/documents.route';
import { StudentServicesRoute } from './routes/studentServices.route';
import { PaymentRoute } from './routes/payments.route';
import { NoteRoute } from './routes/notes.route';
import { ActivityRoute } from './routes/activities.route';
import { CommunicationRoute } from './routes/communications.route';
import { PartnerRoute } from './routes/partners.route';
import { SimCardRoute } from './routes/simCards.route';
import { BankRoute } from './routes/banks.route';
import { InsuranceRoute } from './routes/insurance.route';
import { VisaRoute } from './routes/visa.route';
import { TaxesRoute } from './routes/taxes.route';
import { LoansRoute } from './routes/loans.route';
import { BuildCreditRoute } from './routes/buildCredit.route';
import { HousingRoute } from './routes/housing.route';
import { ForexRoute } from './routes/forex.route';
import { EmploymentRoute } from './routes/employment.route';
import { FoodRoute } from './routes/food.route';
import { CourseRoute } from './routes/course.route';

console.log('Starting env validation...');
validateEnv();
console.log('Env validation complete.');

// Initialize database tables
console.log('DEBUG: calling initializeTables()...');
initializeTables().then(() => {
    console.log('DEBUG: Tables initialized successfully.');
}).catch(err => {
    console.error('Failed to initialize tables:', err);
    process.exit(1);
});

console.log('DEBUG: Proceeding to initialize App...');
console.log('Initializing App...');

const app = new App([
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
]);

app.listen();
