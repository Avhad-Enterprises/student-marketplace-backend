import DB from "@/database";
import { logger } from "@/utils/logger";

export const Tables = {
  COUNTRIES: "countries",
  UNIVERSITIES: "universities",
  STUDENTS: "students",
  APPLICATIONS: "applications",
  STATUS_HISTORY: "status_history",
  DOCUMENTS: "documents",
  STUDENT_SERVICES: "student_services",
  PAYMENTS: "payments",
  STUDENT_NOTES: "student_notes",
  SIM_CARDS: "sim_cards",
  BANKS: "banks",
  INSURANCE: "insurance",
  VISA: "visa",
  TAXES: "taxes",
  LOANS: "loans",
  BUILD_CREDIT: "build_credit",
  HOUSING: "housing",
  FOREX: "forex",
  EMPLOYMENT: "employment",
  FOOD: "food",
  COURSES: "courses",
  AI_ASSISTANT_SETTINGS: "ai_assistant_settings",
  AI_FEATURES: "ai_features",
  BOOKINGS: "bookings",
  ENQUIRIES: "enquiries",
  EXPERTS: "experts",
  BLOGS: "blogs",
  SYSTEM_SETTINGS: "system_settings",
  NOTIFICATION_SETTINGS: "notification_settings",
};

/**
 * Initialize all database tables
 * This function creates all necessary tables if they don't exist
 */
export async function initializeTables() {
  try {
    await DB.raw(`
      CREATE TABLE IF NOT EXISTS system_settings (
        id SERIAL PRIMARY KEY,
        platform_name VARCHAR(255) DEFAULT 'Student Marketplace',
        support_email VARCHAR(255) DEFAULT 'support@studentmarketplace.com',
        primary_currency VARCHAR(10) DEFAULT 'USD',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS notification_settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(100) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        enabled BOOLEAN DEFAULT TRUE,
        type VARCHAR(50) DEFAULT 'email',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Initial Seed for System Settings if empty
      INSERT INTO system_settings (platform_name, support_email, primary_currency)
      SELECT 'Student Marketplace', 'support@studentmarketplace.com', 'USD'
      WHERE NOT EXISTS (SELECT 1 FROM system_settings);

      -- Initial Seed for Notification Settings if empty
      INSERT INTO notification_settings (key, title, description, enabled, type)
      SELECT 'email-leads', 'New Leads', 'Receive an email when a new lead is assigned to you', true, 'email'
      WHERE NOT EXISTS (SELECT 1 FROM notification_settings WHERE key = 'email-leads');

      INSERT INTO notification_settings (key, title, description, enabled, type)
      SELECT 'email-bookings', 'Booking Confirmations', 'Get notified when a student confirms a booking', true, 'email'
      WHERE NOT EXISTS (SELECT 1 FROM notification_settings WHERE key = 'email-bookings');

      INSERT INTO notification_settings (key, title, description, enabled, type)
      SELECT 'push-apps', 'Application Updates', 'Real-time push notifications for application status changes', true, 'push'
      WHERE NOT EXISTS (SELECT 1 FROM notification_settings WHERE key = 'push-apps');

      CREATE TABLE IF NOT EXISTS build_credit (
        id SERIAL PRIMARY KEY,
        reference_id VARCHAR(50) UNIQUE,
        provider_name VARCHAR(255) NOT NULL,
        program_name VARCHAR(255) NOT NULL,
        card_type VARCHAR(100),
        countries_supported INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        student_visible BOOLEAN DEFAULT TRUE,
        credit_limit VARCHAR(100),
        monthly_fee VARCHAR(50),
        building_period VARCHAR(100),
        popularity INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS loans (
        id SERIAL PRIMARY KEY,
        loan_id VARCHAR(50) UNIQUE,
        provider_name VARCHAR(255) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        amount_range VARCHAR(100),
        countries_supported INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        student_visible BOOLEAN DEFAULT TRUE,
        interest_type VARCHAR(50) DEFAULT 'Fixed',
        collateral_required BOOLEAN DEFAULT FALSE,
        approval_rate VARCHAR(50),
        popularity INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS banks (
        id SERIAL PRIMARY KEY,
        bank_id VARCHAR(50) UNIQUE,
        bank_name VARCHAR(255) NOT NULL,
        account_type VARCHAR(255) NOT NULL,
        countries_covered INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        student_visible BOOLEAN DEFAULT TRUE,
        min_balance VARCHAR(100),
        digital_onboarding BOOLEAN DEFAULT TRUE,
        student_friendly BOOLEAN DEFAULT TRUE,
        popularity INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS countries (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        code VARCHAR(10) NOT NULL,
        region VARCHAR(255),
        visa_difficulty VARCHAR(100),
        cost_of_living VARCHAR(100),
        work_rights BOOLEAN DEFAULT FALSE,
        pr_availability BOOLEAN DEFAULT FALSE,
        status VARCHAR(50) DEFAULT 'active',
        popularity INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS universities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        univ_id VARCHAR(100) UNIQUE,
        city VARCHAR(255),
        country_id INTEGER REFERENCES countries(id) ON DELETE CASCADE,
        tuition VARCHAR(255),
        acceptance_rate VARCHAR(100),
        type VARCHAR(100),
        application_status VARCHAR(50) DEFAULT 'open',
        ranking INTEGER DEFAULT 0,
        intakes VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        student_id VARCHAR(50) UNIQUE,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        date_of_birth DATE,
        country_code VARCHAR(10),
        phone_number VARCHAR(20),
        nationality VARCHAR(100),
        current_country VARCHAR(100),
        primary_destination VARCHAR(100),
        intended_intake VARCHAR(100),
        current_stage VARCHAR(100),
        assigned_counselor VARCHAR(100),
        risk_level VARCHAR(20) DEFAULT 'low',
        lead_source VARCHAR(100),
        campaign VARCHAR(255),
        country_preferences JSONB,
        notes TEXT,
        account_status BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        application_id VARCHAR(50) UNIQUE,
        student_db_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        university_name VARCHAR(255),
        country VARCHAR(100),
        intake VARCHAR(100),
        status VARCHAR(50) DEFAULT 'in-progress',
        counselor VARCHAR(100),
        submission_date DATE,
        decision_date DATE,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS status_history (
        id SERIAL PRIMARY KEY,
        student_db_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        stage VARCHAR(100),
        sub_status VARCHAR(100),
        notes TEXT,
        changed_by VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        student_db_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        status VARCHAR(50) DEFAULT 'Uploaded',
        file_type VARCHAR(50),
        file_size VARCHAR(50),
        uploaded_by VARCHAR(255),
        file_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS student_services (
        id SERIAL PRIMARY KEY,
        student_db_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        service_type VARCHAR(100) NOT NULL,
        service_name VARCHAR(255) NOT NULL,
        provider VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        start_date DATE,
        end_date DATE,
        amount DECIMAL(10, 2),
        currency VARCHAR(10) DEFAULT 'USD',
        priority VARCHAR(20),
        notes TEXT,
        assigned_to VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        student_db_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        payment_id VARCHAR(50) UNIQUE,
        invoice_number VARCHAR(50),
        description TEXT,
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'USD',
        status VARCHAR(50) DEFAULT 'pending',
        payment_method VARCHAR(50),
        due_date DATE,
        paid_date DATE,
        created_by VARCHAR(255),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS student_notes (
        id SERIAL PRIMARY KEY,
        student_db_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        note_type VARCHAR(50) DEFAULT 'general',
        title VARCHAR(255),
        content TEXT NOT NULL,
        created_by VARCHAR(255) NOT NULL,
        is_pinned BOOLEAN DEFAULT FALSE,
        tags TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS activities (
        id SERIAL PRIMARY KEY,
        student_db_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        type VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS communications (
        id SERIAL PRIMARY KEY,
        student_db_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        type VARCHAR(100),
        status VARCHAR(50),
        content TEXT,
        sender VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS partners (
        id SERIAL PRIMARY KEY,
        student_db_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        name VARCHAR(255),
        partner_type VARCHAR(100),
        status VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

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
      );

      CREATE TABLE IF NOT EXISTS insurance (
        id SERIAL PRIMARY KEY,
        insurance_id VARCHAR(50) UNIQUE,
        provider_name VARCHAR(255) NOT NULL,
        policy_name VARCHAR(255) NOT NULL,
        coverage_type VARCHAR(100),
        countries_covered INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        student_visible BOOLEAN DEFAULT TRUE,
        duration VARCHAR(100),
        visa_compliant BOOLEAN DEFAULT TRUE,
        mandatory BOOLEAN DEFAULT FALSE,
        popularity INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS visa (
        id SERIAL PRIMARY KEY,
        visa_id VARCHAR(50) UNIQUE,
        visa_type VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        countries_covered INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        student_visible BOOLEAN DEFAULT TRUE,
        processing_difficulty VARCHAR(50) DEFAULT 'Medium',
        work_rights BOOLEAN DEFAULT TRUE,
        high_approval BOOLEAN DEFAULT TRUE,
        popularity INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS taxes (
        id SERIAL PRIMARY KEY,
        tax_id VARCHAR(50) UNIQUE,
        service_name VARCHAR(255) NOT NULL,
        provider VARCHAR(255) NOT NULL,
        filing_type VARCHAR(100) NOT NULL,
        countries_covered INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        student_visible BOOLEAN DEFAULT TRUE,
        residency_type VARCHAR(100),
        complexity VARCHAR(50) DEFAULT 'Medium',
        usage_rate VARCHAR(50),
        popularity INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS housing (
        id SERIAL PRIMARY KEY,
        reference_id VARCHAR(50) UNIQUE,
        provider_name VARCHAR(255) NOT NULL,
        housing_type VARCHAR(100) NOT NULL,
        location VARCHAR(255) NOT NULL,
        countries_covered INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        student_visible BOOLEAN DEFAULT TRUE,
        avg_rent VARCHAR(100),
        verified BOOLEAN DEFAULT FALSE,
        popularity INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS forex (
        id SERIAL PRIMARY KEY,
        forex_id VARCHAR(50) UNIQUE,
        provider_name VARCHAR(255) NOT NULL,
        service_type VARCHAR(100) NOT NULL,
        currency_pairs INTEGER DEFAULT 0,
        countries_covered INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        student_visible BOOLEAN DEFAULT TRUE,
        avg_fee VARCHAR(100),
        transfer_speed VARCHAR(100),
        popularity INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS employment (
        id SERIAL PRIMARY KEY,
        reference_id VARCHAR(50) UNIQUE,
        platform VARCHAR(255) NOT NULL,
        service_type VARCHAR(100) NOT NULL,
        job_types TEXT,
        countries_covered INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        student_visible BOOLEAN DEFAULT TRUE,
        avg_salary VARCHAR(100),
        verified BOOLEAN DEFAULT FALSE,
        popularity INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS food (
        id SERIAL PRIMARY KEY,
        reference_id VARCHAR(50) UNIQUE,
        platform VARCHAR(255) NOT NULL,
        service_type VARCHAR(100) NOT NULL,
        offer_details TEXT,
        countries_covered INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        student_visible BOOLEAN DEFAULT TRUE,
        avg_cost VARCHAR(100),
        verified BOOLEAN DEFAULT FALSE,
        popularity INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        reference_id VARCHAR(50) UNIQUE,
        course_name VARCHAR(255) NOT NULL,
        provider VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        duration VARCHAR(100),
        avg_cost VARCHAR(100),
        countries_covered INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        student_visible BOOLEAN DEFAULT TRUE,
        popularity INTEGER DEFAULT 0,
        learners_count INTEGER DEFAULT 0,
        rating DECIMAL(3,1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS rating DECIMAL(3,1) DEFAULT 0;

      CREATE TABLE IF NOT EXISTS ai_assistant_settings (
        id SERIAL PRIMARY KEY,
        assistant_name VARCHAR(255) DEFAULT 'Study Abroad Visa Assistant',
        tagline VARCHAR(255) DEFAULT 'Your intelligent companion for visa guidance',
        default_language VARCHAR(50) DEFAULT 'en',
        model_provider VARCHAR(50) DEFAULT 'openai',
        model_version VARCHAR(50) DEFAULT 'gpt-4-turbo',
        temperature FLOAT DEFAULT 0.7,
        response_length VARCHAR(50) DEFAULT 'medium',
        memory_window VARCHAR(50) DEFAULT '8k',
        streaming BOOLEAN DEFAULT TRUE,
        timeout INTEGER DEFAULT 30,
        retry_attempts INTEGER DEFAULT 3,
        tone VARCHAR(50) DEFAULT 'friendly',
        answer_style VARCHAR(50) DEFAULT 'detailed',
        communication_style VARCHAR(50) DEFAULT 'conversational',
        confidence_threshold INTEGER DEFAULT 60,
        confidence_visibility VARCHAR(50) DEFAULT 'internal',
        escalation_action VARCHAR(50) DEFAULT 'show-button',
        welcome_message TEXT DEFAULT 'Hello! I am your Study Abroad Visa Assistant. How can I help you today?',
        guardrails JSONB DEFAULT '{"noLegalAdvice": true, "noGuaranteedApproval": true, "noFinancialGuarantee": true, "noImmigrationConsultancy": true, "noPolicyInterpretation": true}'::JSONB,
        escalation_triggers JSONB DEFAULT '{"lowConfidence": true, "userRequestsHuman": true, "cannotAnswer": true, "negativeSentiment": true}'::JSONB,
        formatting_rules JSONB DEFAULT '{"alwaysDisclaimer": true, "showChecklistTable": true, "countryLinks": true, "estimatedTime": true, "ctaButton": true}'::JSONB,
        status VARCHAR(50) DEFAULT 'online',
        strict_mode BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS ai_features (
        id SERIAL PRIMARY KEY,
        feature_id VARCHAR(50) UNIQUE NOT NULL,
        "order" INTEGER DEFAULT 0,
        name VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        show_in_dashboard BOOLEAN DEFAULT TRUE,
        linked_flow VARCHAR(255),
        description TEXT,
        starter_prompt TEXT,
        usage_30d INTEGER DEFAULT 0,
        requires_ielts BOOLEAN DEFAULT FALSE,
        requires_country BOOLEAN DEFAULT FALSE,
        requires_profile BOOLEAN DEFAULT FALSE,
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Initial Seed for AI Features if empty
      INSERT INTO ai_features (feature_id, "order", name, status, linked_flow, description, starter_prompt, usage_30d, category)
      SELECT 'feat-001', 1, 'University Search', 'active', 'university-finder-flow', 'Help students discover universities that match their profile, preferences, and academic goals.', 'I can help you discover universities that match your profile and goals. What type of program are you interested in?', 1248, 'academic'
      WHERE NOT EXISTS (SELECT 1 FROM ai_features WHERE feature_id = 'feat-001');

      INSERT INTO ai_features (feature_id, "order", name, status, linked_flow, description, starter_prompt, usage_30d, category)
      SELECT 'feat-002', 2, 'SOP Review', 'active', 'sop-analysis-flow', 'Share your Statement of Purpose and I''ll provide detailed feedback.', 'Share your Statement of Purpose and I''ll provide detailed feedback.', 856, 'application'
      WHERE NOT EXISTS (SELECT 1 FROM ai_features WHERE feature_id = 'feat-002');

      INSERT INTO ai_features (feature_id, "order", name, status, linked_flow, description, starter_prompt, usage_30d, category)
      SELECT 'feat-003', 3, 'Visa Requirements', 'active', 'visa-info-flow', 'Let me guide you through visa requirements for your destination country.', 'Let me guide you through visa requirements for your destination country.', 734, 'visa'
      WHERE NOT EXISTS (SELECT 1 FROM ai_features WHERE feature_id = 'feat-003');

      INSERT INTO ai_features (feature_id, "order", name, status, linked_flow, description, starter_prompt, usage_30d, category)
      SELECT 'feat-004', 4, 'Eligibility Check', 'active', 'eligibility-flow', 'I''ll help you understand your eligibility for different universities.', 'I''ll help you understand your eligibility for different universities.', 612, 'academic'
      WHERE NOT EXISTS (SELECT 1 FROM ai_features WHERE feature_id = 'feat-004');

      INSERT INTO ai_features (feature_id, "order", name, status, linked_flow, description, starter_prompt, usage_30d, category)
      SELECT 'feat-005', 5, 'Scholarship Finder', 'active', 'scholarship-search-flow', 'Discover scholarships and funding opportunities for your study abroad journey.', 'Discover scholarships and funding opportunities for your study abroad journey.', 489, 'financial'
      WHERE NOT EXISTS (SELECT 1 FROM ai_features WHERE feature_id = 'feat-005');

      INSERT INTO ai_features (feature_id, "order", name, status, linked_flow, description, starter_prompt, usage_30d, category)
      SELECT 'feat-006', 6, 'Timeline Planner', 'disabled', 'timeline-generation-flow', 'I''ll create a personalized timeline for your application journey.', 'I''ll create a personalized timeline for your application journey.', 145, 'academic'
      WHERE NOT EXISTS (SELECT 1 FROM ai_features WHERE feature_id = 'feat-006');

      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        booking_id VARCHAR(50) UNIQUE NOT NULL,
        date_time TIMESTAMP NOT NULL,
        student_name VARCHAR(255) NOT NULL,
        service VARCHAR(255) NOT NULL,
        expert VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'upcoming',
        mode VARCHAR(50) DEFAULT 'Online',
        source VARCHAR(50) DEFAULT 'regular',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Initial Seed for Bookings if empty
      INSERT INTO bookings (booking_id, date_time, student_name, service, expert, status, mode, source)
      SELECT 'BKG-001', '2025-01-15 10:00:00', 'Emma Wilson', 'Initial Consultation', 'Sarah Johnson', 'upcoming', 'Online', 'regular'
      WHERE NOT EXISTS (SELECT 1 FROM bookings WHERE booking_id = 'BKG-001');

      INSERT INTO bookings (booking_id, date_time, student_name, service, expert, status, mode, source)
      SELECT 'BKG-002', '2025-01-16 14:30:00', 'James Chen', 'Concierge Request', 'Mike Davis', 'completed', 'Online', 'concierge'
      WHERE NOT EXISTS (SELECT 1 FROM bookings WHERE booking_id = 'BKG-002');

      CREATE TABLE IF NOT EXISTS enquiries (
        id SERIAL PRIMARY KEY,
        enquiry_id VARCHAR(50) UNIQUE NOT NULL,
        date_submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        student_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT,
        priority VARCHAR(20) DEFAULT 'medium',
        status VARCHAR(20) DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Initial Seed for Enquiries if empty
      INSERT INTO enquiries (enquiry_id, student_name, email, subject, message, priority, status)
      SELECT 'ENQ-001', 'Sarah Miller', 'sarah.m@email.com', 'Visa Application Process', 'I need help with the visa application process.', 'high', 'new'
      WHERE NOT EXISTS (SELECT 1 FROM enquiries WHERE enquiry_id = 'ENQ-001');

      INSERT INTO enquiries (enquiry_id, student_name, email, subject, message, priority, status)
      SELECT 'ENQ-002', 'John Davis', 'john.d@email.com', 'Document Requirements', 'What documents are required for my application?', 'medium', 'in-progress'
      WHERE NOT EXISTS (SELECT 1 FROM enquiries WHERE enquiry_id = 'ENQ-002');

      CREATE TABLE IF NOT EXISTS experts (
        id SERIAL PRIMARY KEY,
        expert_id VARCHAR(50) UNIQUE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        specialization VARCHAR(100),
        experience_years INTEGER DEFAULT 0,
        rating DECIMAL(3,1) DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        avatar_url TEXT,
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Initial Seed for Experts if empty
      INSERT INTO experts (expert_id, full_name, email, specialization, experience_years, rating, status)
      SELECT 'EXP-001', 'Sarah Johnson', 'sarah.j@example.com', 'Visa & Immigration', 8, 4.9, 'active'
      WHERE NOT EXISTS (SELECT 1 FROM experts WHERE expert_id = 'EXP-001');

      INSERT INTO experts (expert_id, full_name, email, specialization, experience_years, rating, status)
      SELECT 'EXP-002', 'Michael Chen', 'm.chen@example.com', 'Academic Counseling', 5, 4.7, 'active'
      WHERE NOT EXISTS (SELECT 1 FROM experts WHERE expert_id = 'EXP-002');

      CREATE TABLE IF NOT EXISTS blogs (
        id SERIAL PRIMARY KEY,
        blog_id VARCHAR(50) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        content TEXT,
        tags JSONB DEFAULT '[]'::JSONB,
        status VARCHAR(50) DEFAULT 'draft',
        visibility VARCHAR(50) DEFAULT 'public',
        publish_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS sops (
        id SERIAL PRIMARY KEY,
        student_name VARCHAR(255) NOT NULL,
        country VARCHAR(255) NOT NULL,
        university VARCHAR(255) NOT NULL,
        review_status VARCHAR(50) DEFAULT 'Draft',
        ai_confidence_score VARCHAR(50) DEFAULT '0%',
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS sop_assistant_settings (
        id SERIAL PRIMARY KEY,
        model_provider VARCHAR(50) DEFAULT 'openai',
        model_version VARCHAR(50) DEFAULT 'gpt-4o',
        system_prompt TEXT DEFAULT 'You are a professional Statement of Purpose (SOP) reviewer. Analyze the provided SOP for clarity, tone, structure, and impact. Provide a confidence score and detailed feedback.',
        confidence_threshold INTEGER DEFAULT 70,
        auto_approval BOOLEAN DEFAULT FALSE,
        max_tokens INTEGER DEFAULT 2000,
        temperature FLOAT DEFAULT 0.5,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Initial Seed for SOP Assistant Settings if empty
      INSERT INTO sop_assistant_settings (model_provider, model_version, system_prompt, confidence_threshold, auto_approval, max_tokens, temperature)
      SELECT 'openai', 'gpt-4o', 'You are a professional Statement of Purpose (SOP) reviewer. Analyze the provided SOP for clarity, tone, structure, and impact. Provide a confidence score and detailed feedback.', 70, false, 2000, 0.5
      WHERE NOT EXISTS (SELECT 1 FROM sop_assistant_settings);

      -- Initial Seed for SOPs if empty
      INSERT INTO sops (student_name, country, university, review_status, ai_confidence_score, status)
      SELECT 'John Doe', 'USA', 'Harvard University', 'Draft', '85%', 'active'
      WHERE NOT EXISTS (SELECT 1 FROM sops WHERE student_name = 'John Doe');

      INSERT INTO sops (student_name, country, university, review_status, ai_confidence_score, status)
      SELECT 'Jane Smith', 'Canada', 'University of Toronto', 'Reviewed', '92%', 'active'
      WHERE NOT EXISTS (SELECT 1 FROM sops WHERE student_name = 'Jane Smith');
    `);

    logger.info("Database tables initialized successfully");
  } catch (err) {
    logger.error("Failed to initialize database tables:", err);
    throw err;
  }
}
