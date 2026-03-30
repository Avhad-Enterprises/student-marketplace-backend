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
  SERVICE_COUNTRY_SETTINGS: "service_country_settings",
  COMPARISON_RULES: "comparison_rules",
  AI_TEST_LIBRARY: "ai_test_library",
  AI_TEST_PLANS_SETTINGS: "ai_test_plans_settings",
  AI_TEST_REPORTS: "ai_test_reports",
  AI_TEST_SCORING_SETTINGS: "ai_test_scoring_settings",
  AI_VISA_SETTINGS: "ai_visa_settings",
  COMMUNICATION_SETTINGS: "communication_settings",
  MESSAGE_TEMPLATES: "message_templates",
  DELIVERY_SAFETY_SETTINGS: "delivery_safety_settings",
};

/**
 * Initialize all database tables
 * This function creates all necessary tables in smaller chunks to prevent timeout
 */
export async function initializeTables() {
  try {
    logger.info("Starting database initialization...");

    // 1. System & Global Settings
    await initSystemSettings();
    // 2. Localization & Regions
    await initLocalizationSettings();
    // 3. Integration & Assets
    await initIntegrationSettings();
    // 4. Policy & Compliance
    await initPolicySettings();
    // 5. Entities & Logistics
    await initCoreEntities();
    // 6. Finance & Payments
    await initFinanceAndPayments();
    // 7. Support & Content
    await initSupportContent();
    // 8. AI & Advanced Tools
    await initAIServices();
    // 9. Security & Privacy
    await initSecuritySafety();

    logger.info("Database initialization completed successfully");
  } catch (err) {
    logger.error("Failed to initialize database tables:", err);
    throw err;
  }
}

// TODO: Implement helper functions below
async function initSystemSettings() {
  await DB.raw(`
    CREATE TABLE IF NOT EXISTS system_settings (
      id SERIAL PRIMARY KEY,
      platform_name VARCHAR(255) DEFAULT 'Student Marketplace',
      support_email VARCHAR(255) DEFAULT 'support@studentmarketplace.com',
      primary_currency VARCHAR(10) DEFAULT 'USD',
       legal_entity_name VARCHAR(255),
      logo_light TEXT, logo_dark TEXT, favicon TEXT,
      environment VARCHAR(50) DEFAULT 'production',
      maintenance_mode BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS manual_admin_approval BOOLEAN DEFAULT FALSE;
    ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS kyc_document_types TEXT;
    ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS feature_flags JSONB DEFAULT '{"betaAccess": false, "aiFeatures": true, "performanceTracing": false}'::JSONB;
    ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS api_logging_enabled BOOLEAN DEFAULT TRUE;
    ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS query_logging_enabled BOOLEAN DEFAULT FALSE;
    ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS system_log_retention_days INTEGER DEFAULT 30;

    -- Figma Redesign Fields: Audit & Monitoring
    ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS enable_audit_logging BOOLEAN DEFAULT TRUE;
    ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS enable_user_activity_logs BOOLEAN DEFAULT TRUE;
    ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS enable_data_change_logs BOOLEAN DEFAULT TRUE;
    ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS enable_login_activity_logs BOOLEAN DEFAULT TRUE;
    ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS failed_login_threshold INTEGER DEFAULT 5;
    ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS webhook_failure_threshold INTEGER DEFAULT 10;
    ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS email_bounce_threshold INTEGER DEFAULT 15;

    -- Figma Redesign Fields: Security & Sessions
    ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS enforce_2fa_admins BOOLEAN DEFAULT FALSE;
    ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS password_complexity_rules BOOLEAN DEFAULT TRUE;
    ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS password_expiry_days INTEGER DEFAULT 90;
    ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS ip_allowlist TEXT;

    -- Figma Redesign Fields: System Defaults & Limits
    ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS global_rate_limit INTEGER DEFAULT 1000;
    ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS max_file_upload_mb INTEGER DEFAULT 50;
    ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS max_concurrent_exports INTEGER DEFAULT 5;
    ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS pagination_default_size INTEGER DEFAULT 25;

    -- Figma Redesign Fields: Backup & Recovery
    ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS backup_frequency VARCHAR(50) DEFAULT 'Daily';
    ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS backup_retention_days INTEGER DEFAULT 30;

    -- Feature Flags Expanded
    ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS enable_beta_features BOOLEAN DEFAULT FALSE;
    ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS environment_scope VARCHAR(50) DEFAULT 'Production';
    
    INSERT INTO system_settings (id, platform_name)
    SELECT 1, 'Student Marketplace' WHERE NOT EXISTS (SELECT 1 FROM system_settings WHERE id = 1);

    CREATE TABLE IF NOT EXISTS admin_notification_settings (
      id SERIAL PRIMARY KEY,
      alert_recipient_roles TEXT DEFAULT '["Admin", "Manager"]',
      enable_student_email_notifications BOOLEAN DEFAULT TRUE,
      escalation_email VARCHAR(255) DEFAULT 'escalation@company.com',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    INSERT INTO admin_notification_settings (id)
    SELECT 1 WHERE NOT EXISTS (SELECT 1 FROM admin_notification_settings WHERE id = 1);

    CREATE TABLE IF NOT EXISTS notification_settings (
      id SERIAL PRIMARY KEY,
      key VARCHAR(100) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      enabled BOOLEAN DEFAULT TRUE,
      type VARCHAR(50) DEFAULT 'email',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

async function initLocalizationSettings() {
  await DB.raw(`
    CREATE TABLE IF NOT EXISTS localization_settings (
      id SERIAL PRIMARY KEY,
      default_language VARCHAR(100) DEFAULT 'English',
      fallback_language VARCHAR(100) DEFAULT 'English',
      enable_multi_language BOOLEAN DEFAULT TRUE,
      default_timezone VARCHAR(100) DEFAULT 'UTC',
      date_format VARCHAR(100) DEFAULT 'MM/DD/YYYY (US)',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    INSERT INTO localization_settings (id)
    SELECT 1 WHERE NOT EXISTS (SELECT 1 FROM localization_settings WHERE id = 1);
  `);
}

async function initIntegrationSettings() {
  await DB.raw(`
    CREATE TABLE IF NOT EXISTS integration_settings (
      id SERIAL PRIMARY KEY,
      enable_public_api BOOLEAN DEFAULT TRUE,
      api_key VARCHAR(255) DEFAULT 'sk_test_51Mz...',
      api_key_rotation VARCHAR(50) DEFAULT 'Manual',
      api_key_expiry_days INTEGER DEFAULT 90,
      api_rate_limit INTEGER DEFAULT 1000,
      allowed_ip_whitelist TEXT,
      enable_webhooks BOOLEAN DEFAULT TRUE,
      webhook_endpoint_url VARCHAR(255),
      webhook_secret_key VARCHAR(255),
      webhook_events TEXT,
      integration_provider VARCHAR(100),
      ai_service_provider VARCHAR(100) DEFAULT 'OpenAI GPT-4',
      file_storage_provider VARCHAR(100) DEFAULT 'AWS S3',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    INSERT INTO integration_settings (id)
    SELECT 1 WHERE NOT EXISTS (SELECT 1 FROM integration_settings WHERE id = 1);

    CREATE TABLE IF NOT EXISTS file_settings (
      id SERIAL PRIMARY KEY,
      storage_provider VARCHAR(100) DEFAULT 'AWS S3',
      storage_region VARCHAR(100) DEFAULT 'US East (N. Virginia)',
      max_storage_limit_gb INTEGER DEFAULT 100,
      file_retention_period_days INTEGER DEFAULT 365,
      enable_auto_cleanup BOOLEAN DEFAULT TRUE,
      allowed_file_types TEXT DEFAULT '["PDF", "DOC", "DOCX", "JPG", "JPEG", "PNG", "GIF", "MP4", "MOV", "ZIP"]',
      max_file_size_mb INTEGER DEFAULT 10,
      duplicate_file_handling VARCHAR(50) DEFAULT 'Rename (add suffix)',
      image_upload_limit_mb INTEGER DEFAULT 50,
      video_upload_limit_mb INTEGER DEFAULT 500,
      document_upload_limit_mb INTEGER DEFAULT 20,
      enable_image_compression BOOLEAN DEFAULT TRUE,
      enable_thumbnail_generation BOOLEAN DEFAULT TRUE,
      enable_document_preview BOOLEAN DEFAULT TRUE,
      enable_virus_scan BOOLEAN DEFAULT TRUE,
      enable_file_encryption BOOLEAN DEFAULT FALSE,
      default_file_visibility VARCHAR(50) DEFAULT 'Private (authentication required)',
      temp_link_expiry_hours INTEGER DEFAULT 24,
      enable_role_based_access BOOLEAN DEFAULT TRUE,
      enable_temp_download_links BOOLEAN DEFAULT TRUE,
      enable_folder_structure BOOLEAN DEFAULT TRUE,
      enable_asset_tagging BOOLEAN DEFAULT TRUE,
      enable_file_versioning BOOLEAN DEFAULT FALSE,
      enable_archive_old_assets BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    INSERT INTO file_settings (id)
    SELECT 1 WHERE NOT EXISTS (SELECT 1 FROM file_settings WHERE id = 1);
  `);
}

async function initPolicySettings() {
  await DB.raw(`
    CREATE TABLE IF NOT EXISTS policy_global_settings (
      id SERIAL PRIMARY KEY,
      enable_reacceptance BOOLEAN DEFAULT TRUE,
      enable_consent_timestamp BOOLEAN DEFAULT TRUE,
      log_retention_months INTEGER DEFAULT 24,
      legal_contact_email VARCHAR(255) DEFAULT 'legal@example.com',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    INSERT INTO policy_global_settings (id)
    SELECT 1 WHERE NOT EXISTS (SELECT 1 FROM policy_global_settings WHERE id = 1);

    CREATE TABLE IF NOT EXISTS policy_pages (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE,
      type VARCHAR(100) NOT NULL,
      status VARCHAR(50) DEFAULT 'Published',
      version VARCHAR(20) DEFAULT 'v1.0',
      effective_date DATE,
      visibility VARCHAR(50) DEFAULT 'Public',
      content TEXT,
      author_name VARCHAR(100),
      last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

async function initCoreEntities() {
  await DB.raw(`
    CREATE TABLE IF NOT EXISTS countries (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      code VARCHAR(10) NOT NULL,
      status VARCHAR(50) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS universities (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      univ_id VARCHAR(100) UNIQUE,
      country_id INTEGER REFERENCES countries(id) ON DELETE CASCADE,
      status VARCHAR(50) DEFAULT 'active',
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS students (
      id SERIAL PRIMARY KEY,
      student_id VARCHAR(50) UNIQUE,
      email VARCHAR(255) UNIQUE NOT NULL,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS applications (
      id SERIAL PRIMARY KEY,
      application_id VARCHAR(50) UNIQUE,
      student_db_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
      status VARCHAR(50) DEFAULT 'in-progress',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

async function initFinanceAndPayments() {
  await DB.raw(`
    CREATE TABLE IF NOT EXISTS finance_settings (
      id SERIAL PRIMARY KEY,
      primary_currency VARCHAR(100) DEFAULT 'USD',
      exchange_rate_provider VARCHAR(100) DEFAULT 'Open Exchange Rates',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    INSERT INTO finance_settings (id)
    SELECT 1 WHERE NOT EXISTS (SELECT 1 FROM finance_settings WHERE id = 1);

    CREATE TABLE IF NOT EXISTS payments (
      id SERIAL PRIMARY KEY,
      student_db_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
      payment_id VARCHAR(50) UNIQUE,
      amount DECIMAL(10, 2) NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

async function initSupportContent() {
  await DB.raw(`
    CREATE TABLE IF NOT EXISTS experts (
      id SERIAL PRIMARY KEY,
      expert_id VARCHAR(50) UNIQUE NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      status VARCHAR(50) DEFAULT 'active'
    );

    CREATE TABLE IF NOT EXISTS blogs (
      id SERIAL PRIMARY KEY,
      blog_id VARCHAR(50) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      status VARCHAR(50) DEFAULT 'draft',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

async function initAIServices() {
  await DB.raw(`
    CREATE TABLE IF NOT EXISTS ai_assistant_settings (
      id SERIAL PRIMARY KEY,
      assistant_name VARCHAR(255) DEFAULT 'Study Abroad AI',
      model_version VARCHAR(50) DEFAULT 'gpt-4',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    INSERT INTO ai_assistant_settings (id)
    SELECT 1 WHERE NOT EXISTS (SELECT 1 FROM ai_assistant_settings WHERE id = 1);
  `);
}

async function initSecuritySafety() {
  await DB.raw(`
    CREATE TABLE IF NOT EXISTS delivery_safety_settings (
      id SERIAL PRIMARY KEY,
      api_requests_per_minute INTEGER DEFAULT 100,
      login_attempts_per_hour INTEGER DEFAULT 5,
      booking_creation_limit_per_user INTEGER DEFAULT 10,
      form_submissions_per_ip INTEGER DEFAULT 20,
      file_upload_limit_mb INTEGER DEFAULT 50,
      enable_captcha BOOLEAN DEFAULT TRUE,
      block_tor_nodes BOOLEAN DEFAULT FALSE,
      honeypot_enabled BOOLEAN DEFAULT TRUE,
      pii_masking BOOLEAN DEFAULT TRUE,
      auto_deletion_days INTEGER DEFAULT 365,
      mfa_required BOOLEAN DEFAULT FALSE,
      session_concurrency INTEGER DEFAULT 3,
      real_time_alerts BOOLEAN DEFAULT TRUE,
      security_logs_retention_days INTEGER DEFAULT 90,
      block_disposable_emails BOOLEAN DEFAULT TRUE,
      auto_block_failed_logins BOOLEAN DEFAULT TRUE,
      auto_flag_suspicious BOOLEAN DEFAULT TRUE,
      suspicious_threshold_count INTEGER DEFAULT 3,
      auto_lock_duration_mins INTEGER DEFAULT 30,
      auto_delete_inactive_days INTEGER DEFAULT 730,
      encrypt_documents BOOLEAN DEFAULT TRUE,
      session_timeout_mins INTEGER DEFAULT 30,
      password_reset_days INTEGER DEFAULT 90,
      allow_multiple_sessions BOOLEAN DEFAULT FALSE,
      ip_whitelist TEXT,
      enable_activity_logging BOOLEAN DEFAULT TRUE,
      enable_admin_logs BOOLEAN DEFAULT TRUE,
      enable_ip_tracking BOOLEAN DEFAULT TRUE,
      enable_ai_logs BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    INSERT INTO delivery_safety_settings (id)
    SELECT 1 WHERE NOT EXISTS (SELECT 1 FROM delivery_safety_settings WHERE id = 1);
  `);
}
