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
  GENERAL_SETTINGS: "general_settings",
  USERS: "users",
  ROLES: "roles",
  // Communications module tables
  INTEGRATION_CONFIGS: "integration_configs",
  COMMUNICATION_TEMPLATES: "communication_templates",
  EMAIL_LOGS: "email_logs",
  SENDER_IDENTITIES: "sender_identities",
  AUTOMATION_RULES: "automation_rules",
  AUDIENCE_SEGMENTS: "audience_segments",
  PARTNERS: "partners",
  SOPS: "sops",
  SOP_ASSISTANT_SETTINGS: "sop_assistant_settings",
  AI_ASSISTANT_SETTINGS_VERSIONS: "ai_assistant_settings_versions",
  REPORTS: "reports",
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
    // 10. Communications & Lifecycle
    await initCommunications();
    // 11. General Settings
    await initGeneralSettings();
    // 12. Marketplace & Services
    await initMarketplaceServices();
    // 13. Bookings & Leads
    await initBookingsAndLeads();
    // 14. Status Tracking & History
    await initStatusHistory();
    // 15. Reporting & Analytics
    await initReporting();
    // 16. Documents & Storage
    await initDocuments();
    // 17. Performance Hardening (Indexing)
    await initPerformanceIndexes();

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

    ALTER TABLE applications ADD COLUMN IF NOT EXISTS student_db_id INTEGER REFERENCES students(id) ON DELETE CASCADE;
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
      student_db_id INTEGER REFERENCES students(id) ON DELETE RESTRICT,
      payment_id VARCHAR(50) UNIQUE,
      invoice_number VARCHAR(100) UNIQUE,
      description TEXT,
      amount DECIMAL(15, 2) NOT NULL,
      currency VARCHAR(10) DEFAULT 'USD',
      service_type VARCHAR(100),
      status VARCHAR(50) DEFAULT 'pending',
      payment_method VARCHAR(100),
      due_date DATE,
      paid_date DATE,
      notes TEXT,
      created_by VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS payment_status_history (
      id SERIAL PRIMARY KEY,
      payment_db_id INTEGER REFERENCES payments(id) ON DELETE CASCADE,
      old_status VARCHAR(50),
      new_status VARCHAR(50) NOT NULL,
      changed_by VARCHAR(255),
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    ALTER TABLE payments ALTER COLUMN amount TYPE DECIMAL(15, 2);
    ALTER TABLE payments ADD COLUMN IF NOT EXISTS invoice_number VARCHAR(100) UNIQUE;
    ALTER TABLE payments ADD COLUMN IF NOT EXISTS description TEXT;
    ALTER TABLE payments ADD COLUMN IF NOT EXISTS student_db_id INTEGER REFERENCES students(id) ON DELETE RESTRICT;
    ALTER TABLE payments ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'USD';
    ALTER TABLE payments ADD COLUMN IF NOT EXISTS service_type VARCHAR(100);
    ALTER TABLE payments ADD COLUMN IF NOT EXISTS payment_method VARCHAR(100);
    ALTER TABLE payments ADD COLUMN IF NOT EXISTS due_date DATE;
    ALTER TABLE payments ADD COLUMN IF NOT EXISTS paid_date DATE;
    ALTER TABLE payments ADD COLUMN IF NOT EXISTS notes TEXT;
    ALTER TABLE payments ADD COLUMN IF NOT EXISTS created_by VARCHAR(255);
    ALTER TABLE payments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
  `);
}

async function initSupportContent() {
  await DB.raw(`
    CREATE TABLE IF NOT EXISTS experts (
      id SERIAL PRIMARY KEY,
      expert_id VARCHAR(50) UNIQUE NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE,
      status VARCHAR(50) DEFAULT 'active'
    );

    -- Robustly ensure column is nullable
    DO $$ 
    BEGIN 
        ALTER TABLE experts ALTER COLUMN email DROP NOT NULL;
    EXCEPTION 
        WHEN OTHERS THEN 
            RAISE NOTICE 'Could not relax email constraint on experts table: %', SQLERRM;
    END $$;

    CREATE TABLE IF NOT EXISTS blogs (
      id SERIAL PRIMARY KEY,
      blog_id VARCHAR(50) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255),
      category VARCHAR(100),
      content TEXT,
      tags TEXT,
      status VARCHAR(50) DEFAULT 'draft',
      visibility VARCHAR(50) DEFAULT 'public',
      publish_date TIMESTAMP,
      meta_title VARCHAR(255),
      meta_description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    ALTER TABLE blogs ADD COLUMN IF NOT EXISTS author VARCHAR(255);
    ALTER TABLE blogs ADD COLUMN IF NOT EXISTS category VARCHAR(100);
    ALTER TABLE blogs ADD COLUMN IF NOT EXISTS content TEXT;
    ALTER TABLE blogs ADD COLUMN IF NOT EXISTS tags TEXT;
    ALTER TABLE blogs ADD COLUMN IF NOT EXISTS visibility VARCHAR(50) DEFAULT 'public';
    ALTER TABLE blogs ADD COLUMN IF NOT EXISTS publish_date TIMESTAMP;
    ALTER TABLE blogs ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255);
    ALTER TABLE blogs ADD COLUMN IF NOT EXISTS meta_description TEXT;
    ALTER TABLE blogs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
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

    CREATE TABLE IF NOT EXISTS ai_assistant_settings_versions (
      id SERIAL PRIMARY KEY,
      settings_data JSONB NOT NULL,
      version_label VARCHAR(255),
      created_by VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sop_assistant_settings (
      id SERIAL PRIMARY KEY,
      model_provider VARCHAR(100) DEFAULT 'openai',
      model_version VARCHAR(50) DEFAULT 'gpt-4',
      system_prompt TEXT,
      confidence_threshold INTEGER DEFAULT 70,
      auto_approval BOOLEAN DEFAULT FALSE,
      max_tokens INTEGER DEFAULT 2000,
      temperature DECIMAL(3, 2) DEFAULT 0.7,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sops (
      id SERIAL PRIMARY KEY,
      student_id VARCHAR(50),
      student_name VARCHAR(255),
      country VARCHAR(255),
      university VARCHAR(255),
      review_status VARCHAR(100) DEFAULT 'Draft',
      ai_confidence_score VARCHAR(20) DEFAULT '0%',
      status VARCHAR(50) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
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

async function initGeneralSettings() {
  await DB.raw(`
    CREATE TABLE IF NOT EXISTS general_settings (
      id SERIAL PRIMARY KEY,
      key VARCHAR(100) UNIQUE NOT NULL,
      value TEXT,
      group_name VARCHAR(50) DEFAULT 'general',
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Seed mandatory legal keys
    INSERT INTO general_settings (key, value, group_name)
    VALUES 
      ('privacy_policy', '', 'legal'),
      ('terms_of_use', '', 'legal'),
      ('gdpr_enabled', 'false', 'compliance')
    ON CONFLICT (key) DO NOTHING;
  `);
}

async function initCommunications() {
  await DB.raw(`
    -- Integration Configs (SendGrid, SMTP, etc.)
    CREATE TABLE IF NOT EXISTS integration_configs (
      id SERIAL PRIMARY KEY,
      event_id INTEGER REFERENCES universities(id) ON DELETE CASCADE,
      type VARCHAR(50) NOT NULL, -- email, sms, whatsapp
      provider VARCHAR(50) NOT NULL, -- sendgrid, smtp, twilio
      is_enabled BOOLEAN DEFAULT TRUE,
      config TEXT, -- JSON configuration
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Communication Templates (Generic templates)
    CREATE TABLE IF NOT EXISTS communication_templates (
      id SERIAL PRIMARY KEY,
      event_id INTEGER REFERENCES universities(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      channel VARCHAR(50) NOT NULL,
      subject TEXT,
      content TEXT NOT NULL,
      is_deleted BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Event Campaigns
    CREATE TABLE IF NOT EXISTS event_campaigns (
      id SERIAL PRIMARY KEY,
      event_id INTEGER REFERENCES universities(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      channel VARCHAR(50) NOT NULL, -- email, sms
      campaign_type VARCHAR(50) DEFAULT 'one-time',
      status VARCHAR(50) DEFAULT 'draft',
      template_id INTEGER REFERENCES communication_templates(id) ON DELETE SET NULL,
      subject TEXT,
      content TEXT,
      sender VARCHAR(255),
      audience_rule JSONB,
      scheduled_at TIMESTAMP,
      sent_at TIMESTAMP,
      total_recipients INTEGER DEFAULT 0,
      sent_count INTEGER DEFAULT 0,
      delivered_count INTEGER DEFAULT 0,
      open_count INTEGER DEFAULT 0,
      click_count INTEGER DEFAULT 0,
      bounce_count INTEGER DEFAULT 0,
      unsubscribe_count INTEGER DEFAULT 0,
      is_deleted BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Campaign Recipients
    CREATE TABLE IF NOT EXISTS campaign_recipients (
      id SERIAL PRIMARY KEY,
      campaign_id INTEGER REFERENCES event_campaigns(id) ON DELETE CASCADE,
      issued_ticket_id INTEGER,
      recipient_email VARCHAR(255),
      recipient_phone VARCHAR(255),
      recipient_name VARCHAR(255),
      status VARCHAR(50) DEFAULT 'pending',
      sent_at TIMESTAMP,
      delivered_at TIMESTAMP,
      opened_at TIMESTAMP,
      clicked_at TIMESTAMP,
      error_message TEXT,
      metadata JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Email Logs
    CREATE TABLE IF NOT EXISTS email_logs (
      id SERIAL PRIMARY KEY,
      event_id INTEGER REFERENCES universities(id) ON DELETE CASCADE,
      scenario VARCHAR(100),
      to_email VARCHAR(255) NOT NULL,
      subject TEXT,
      status VARCHAR(50) NOT NULL, -- sent, failed, skipped
      provider VARCHAR(50),
      message_id VARCHAR(255),
      error_message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Sender Identities
    CREATE TABLE IF NOT EXISTS sender_identities (
      id SERIAL PRIMARY KEY,
      display_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      reply_to VARCHAR(255),
      linked_brand VARCHAR(255),
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Automation Rules
    CREATE TABLE IF NOT EXISTS automation_rules (
      id SERIAL PRIMARY KEY,
      event_id INTEGER REFERENCES universities(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      trigger_event VARCHAR(100) NOT NULL,
      action_type VARCHAR(100) NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    -- Audience Segments
    CREATE TABLE IF NOT EXISTS audience_segments (
      id SERIAL PRIMARY KEY,
      event_id INTEGER REFERENCES universities(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      match_type VARCHAR(50) DEFAULT 'ALL',
      rules_json TEXT, -- JSON rules
      estimated_count INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      last_evaluated_at TIMESTAMP,
      is_deleted BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Audience Segment Members
    CREATE TABLE IF NOT EXISTS audience_segment_members (
      id SERIAL PRIMARY KEY,
      segment_id INTEGER REFERENCES audience_segments(id) ON DELETE CASCADE,
      student_db_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(segment_id, student_db_id)
    );

    -- Migration safety for existing instances
    DO $$ 
    BEGIN 
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='audience_segments') THEN
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audience_segments' AND column_name='estimated_count') THEN
                ALTER TABLE audience_segments ADD COLUMN estimated_count INTEGER DEFAULT 0;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audience_segments' AND column_name='last_evaluated_at') THEN
                ALTER TABLE audience_segments ADD COLUMN last_evaluated_at TIMESTAMP;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audience_segments' AND column_name='is_deleted') THEN
                ALTER TABLE audience_segments ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;
            END IF;
        END IF;
    END $$;
  `);
}

async function initMarketplaceServices() {
  await DB.raw(`
    -- 1. Partners (Provider Overview)
    CREATE TABLE IF NOT EXISTS partners (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      partner_type VARCHAR(100),
      contact_email VARCHAR(255),
      status VARCHAR(50) DEFAULT 'active',
      is_deleted BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. SIM Cards
    CREATE TABLE IF NOT EXISTS sim_cards (
      id SERIAL PRIMARY KEY,
      sim_id VARCHAR(50) UNIQUE,
      provider_name VARCHAR(255) NOT NULL,
      service_name VARCHAR(255) NOT NULL,
      status VARCHAR(50) DEFAULT 'active',
      network_type VARCHAR(50),
      data_allowance VARCHAR(100),
      validity VARCHAR(100),
      price DECIMAL(10, 2),
      provider_id INTEGER REFERENCES partners(id) ON DELETE SET NULL,
      is_deleted BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 3. Banks
    CREATE TABLE IF NOT EXISTS banks (
      id SERIAL PRIMARY KEY,
      bank_name VARCHAR(255) NOT NULL,
      account_type VARCHAR(100),
      interest_rate DECIMAL(5, 2),
      minimum_balance DECIMAL(10, 2),
      features TEXT,
      status VARCHAR(50) DEFAULT 'active',
      provider_id INTEGER REFERENCES partners(id) ON DELETE SET NULL,
      is_deleted BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 4. Insurance
    CREATE TABLE IF NOT EXISTS insurance (
      id SERIAL PRIMARY KEY,
      provider_name VARCHAR(255) NOT NULL,
      plan_name VARCHAR(255) NOT NULL,
      coverage_amount DECIMAL(15, 2),
      premium DECIMAL(10, 2),
      insurance_type VARCHAR(100), -- Health, Travel, etc.
      status VARCHAR(50) DEFAULT 'active',
      provider_id INTEGER REFERENCES partners(id) ON DELETE SET NULL,
      is_deleted BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 5. Visa
    CREATE TABLE IF NOT EXISTS visa (
      id SERIAL PRIMARY KEY,
      country_id INTEGER REFERENCES countries(id) ON DELETE CASCADE,
      visa_type VARCHAR(100) NOT NULL,
      processing_time VARCHAR(100),
      fee DECIMAL(10, 2),
      requirements TEXT,
      status VARCHAR(50) DEFAULT 'active',
      provider_id INTEGER REFERENCES partners(id) ON DELETE SET NULL,
      is_deleted BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 6. Taxes
    CREATE TABLE IF NOT EXISTS taxes (
      id SERIAL PRIMARY KEY,
      service_name VARCHAR(255) NOT NULL,
      description TEXT,
      fee DECIMAL(10, 2),
      status VARCHAR(50) DEFAULT 'active',
      provider_id INTEGER REFERENCES partners(id) ON DELETE SET NULL,
      is_deleted BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 7. Loans
    CREATE TABLE IF NOT EXISTS loans (
      id SERIAL PRIMARY KEY,
      provider_name VARCHAR(255) NOT NULL,
      loan_type VARCHAR(100) NOT NULL,
      max_amount DECIMAL(15, 2),
      interest_rate DECIMAL(5, 2),
      tenure VARCHAR(100),
      status VARCHAR(50) DEFAULT 'active',
      provider_id INTEGER REFERENCES partners(id) ON DELETE SET NULL,
      is_deleted BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 8. Build Credit
    CREATE TABLE IF NOT EXISTS build_credit (
      id SERIAL PRIMARY KEY,
      service_name VARCHAR(255) NOT NULL,
      provider_name VARCHAR(255) NOT NULL,
      features TEXT,
      monthly_fee DECIMAL(10, 2),
      status VARCHAR(50) DEFAULT 'active',
      provider_id INTEGER REFERENCES partners(id) ON DELETE SET NULL,
      is_deleted BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 9. Housing
    CREATE TABLE IF NOT EXISTS housing (
      id SERIAL PRIMARY KEY,
      property_name VARCHAR(255) NOT NULL,
      location VARCHAR(255),
      property_type VARCHAR(100),
      rent DECIMAL(10, 2),
      amenities TEXT,
      status VARCHAR(50) DEFAULT 'active',
      provider_id INTEGER REFERENCES partners(id) ON DELETE SET NULL,
      is_deleted BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 10. Forex
    CREATE TABLE IF NOT EXISTS forex (
      id SERIAL PRIMARY KEY,
      from_currency VARCHAR(10) NOT NULL,
      to_currency VARCHAR(10) NOT NULL,
      exchange_rate DECIMAL(15, 6),
      fees DECIMAL(10, 2),
      provider_name VARCHAR(255),
      status VARCHAR(50) DEFAULT 'active',
      provider_id INTEGER REFERENCES partners(id) ON DELETE SET NULL,
      is_deleted BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 11. Employment
    CREATE TABLE IF NOT EXISTS employment (
      id SERIAL PRIMARY KEY,
      company_name VARCHAR(255) NOT NULL,
      job_role VARCHAR(255) NOT NULL,
      location VARCHAR(255),
      employment_type VARCHAR(100),
      salary_range VARCHAR(255),
      status VARCHAR(50) DEFAULT 'active',
      provider_id INTEGER REFERENCES partners(id) ON DELETE SET NULL,
      is_deleted BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 12. Food
    CREATE TABLE IF NOT EXISTS food (
      id SERIAL PRIMARY KEY,
      service_name VARCHAR(255) NOT NULL,
      food_type VARCHAR(100),
      delivery_fee DECIMAL(10, 2),
      areas_covered TEXT,
      status VARCHAR(50) DEFAULT 'active',
      provider_id INTEGER REFERENCES partners(id) ON DELETE SET NULL,
      is_deleted BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 13. Courses
    CREATE TABLE IF NOT EXISTS courses (
      id SERIAL PRIMARY KEY,
      course_name VARCHAR(255) NOT NULL,
      university_id INTEGER REFERENCES universities(id) ON DELETE CASCADE,
      duration VARCHAR(100),
      fee DECIMAL(10, 2),
      language VARCHAR(100),
      status VARCHAR(50) DEFAULT 'active',
      provider_id INTEGER REFERENCES partners(id) ON DELETE SET NULL,
      is_deleted BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Ensure all 13 marketplace tables have standard columns (is_deleted, provider_id)
    DO $$
    DECLARE
        tbl_name TEXT;
        tables_to_check TEXT[] := ARRAY['partners', 'sim_cards', 'banks', 'insurance', 'visa', 'taxes', 'loans', 'build_credit', 'housing', 'forex', 'employment', 'food', 'courses'];
    BEGIN
        FOREACH tbl_name IN ARRAY tables_to_check
        LOOP
            -- Add is_deleted if missing
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = tbl_name AND column_name = 'is_deleted') THEN
                EXECUTE format('ALTER TABLE %I ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE', tbl_name);
            END IF;

            -- Add provider_id if missing (except for partners itself where it's the ID)
            IF tbl_name <> 'partners' THEN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = tbl_name AND column_name = 'provider_id') THEN
                    EXECUTE format('ALTER TABLE %I ADD COLUMN provider_id INTEGER REFERENCES partners(id) ON DELETE SET NULL', tbl_name);
                END IF;
            END IF;

            -- Add created_at/updated_at if missing (safety check)
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = tbl_name AND column_name = 'created_at') THEN
                EXECUTE format('ALTER TABLE %I ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP', tbl_name);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = tbl_name AND column_name = 'updated_at') THEN
                EXECUTE format('ALTER TABLE %I ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP', tbl_name);
            END IF;
        END LOOP;
    END $$;
  `);
}

async function initBookingsAndLeads() {
  await DB.raw(`
    -- 1. Enquiries
    CREATE TABLE IF NOT EXISTS enquiries (
      id SERIAL PRIMARY KEY,
      enquiry_id VARCHAR(50) UNIQUE NOT NULL,
      student_db_id INTEGER REFERENCES students(id) ON DELETE SET NULL,
      student_name VARCHAR(255),
      email VARCHAR(255),
      subject TEXT,
      message TEXT,
      status VARCHAR(50) DEFAULT 'new', -- new, in-progress, responded, closed
      priority VARCHAR(50) DEFAULT 'medium', -- low, medium, high
      source VARCHAR(100),
      is_deleted BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      date_submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. Bookings
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      booking_id VARCHAR(50) UNIQUE NOT NULL,
      enquiry_id INTEGER REFERENCES enquiries(id) ON DELETE SET NULL,
      student_db_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
      student_name VARCHAR(255),
      service VARCHAR(100) NOT NULL,
      expert VARCHAR(255),
      date_time TIMESTAMP NOT NULL,
      duration_mins INTEGER DEFAULT 60,
      status VARCHAR(50) DEFAULT 'upcoming', -- upcoming, completed, cancelled, no-show
      mode VARCHAR(50), -- online, in-person
      source VARCHAR(100),
      meeting_link TEXT,
      notes TEXT,
      is_deleted BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Safety: Add columns if they were missing from existing tables
    ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS student_db_id INTEGER REFERENCES students(id) ON DELETE SET NULL;
    ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS student_name VARCHAR(255);
    ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS email VARCHAR(255);
    ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS source VARCHAR(100);
    ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS priority VARCHAR(50) DEFAULT 'medium';
    ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
    ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS date_submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS student_db_id INTEGER REFERENCES students(id) ON DELETE CASCADE;
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS enquiry_id INTEGER REFERENCES enquiries(id) ON DELETE SET NULL;
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS student_name VARCHAR(255);
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS expert VARCHAR(255);
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS mode VARCHAR(50);
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS source VARCHAR(100);
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

    -- Strategic Indexes for Bookings & Leads
    CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries (status);
    CREATE INDEX IF NOT EXISTS idx_enquiries_student ON enquiries (student_db_id);
    CREATE INDEX IF NOT EXISTS idx_enquiries_is_deleted ON enquiries (is_deleted);
    CREATE INDEX IF NOT EXISTS idx_bookings_student ON bookings (student_db_id);
    CREATE INDEX IF NOT EXISTS idx_bookings_date_time ON bookings (date_time DESC);
    CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);
    CREATE INDEX IF NOT EXISTS idx_bookings_is_deleted ON bookings (is_deleted);
  `);
}

async function initPerformanceIndexes() {
  logger.info("Applying strategic performance indexes...");
  await DB.raw(`
    -- Indexing Strategy: provider_id, status, is_deleted, created_at
    -- This ensures O(log n) lookups for RBAC, filtering, and sorting.

    -- 1. Partners
    CREATE INDEX IF NOT EXISTS idx_partners_status ON partners (status);
    CREATE INDEX IF NOT EXISTS idx_partners_deleted ON partners (is_deleted);
    CREATE INDEX IF NOT EXISTS idx_partners_created ON partners (created_at DESC);

    -- 2. SIM Cards
    CREATE INDEX IF NOT EXISTS idx_sim_provider ON sim_cards (provider_id);
    CREATE INDEX IF NOT EXISTS idx_sim_status ON sim_cards (status);
    CREATE INDEX IF NOT EXISTS idx_sim_deleted ON sim_cards (is_deleted);
    CREATE INDEX IF NOT EXISTS idx_sim_created ON sim_cards (created_at DESC);

    -- 3. Banks
    CREATE INDEX IF NOT EXISTS idx_banks_provider ON banks (provider_id);
    CREATE INDEX IF NOT EXISTS idx_banks_status ON banks (status);
    CREATE INDEX IF NOT EXISTS idx_banks_deleted ON banks (is_deleted);
    CREATE INDEX IF NOT EXISTS idx_banks_created ON banks (created_at DESC);

    -- 4. Insurance
    CREATE INDEX IF NOT EXISTS idx_insurance_provider ON insurance (provider_id);
    CREATE INDEX IF NOT EXISTS idx_insurance_status ON insurance (status);
    CREATE INDEX IF NOT EXISTS idx_insurance_deleted ON insurance (is_deleted);
    CREATE INDEX IF NOT EXISTS idx_insurance_created ON insurance (created_at DESC);

    -- 5. Visa
    CREATE INDEX IF NOT EXISTS idx_visa_provider ON visa (provider_id);
    CREATE INDEX IF NOT EXISTS idx_visa_status ON visa (status);
    CREATE INDEX IF NOT EXISTS idx_visa_deleted ON visa (is_deleted);
    CREATE INDEX IF NOT EXISTS idx_visa_created ON visa (created_at DESC);

    -- 6. Taxes
    CREATE INDEX IF NOT EXISTS idx_taxes_provider ON taxes (provider_id);
    CREATE INDEX IF NOT EXISTS idx_taxes_status ON taxes (status);
    CREATE INDEX IF NOT EXISTS idx_taxes_deleted ON taxes (is_deleted);
    CREATE INDEX IF NOT EXISTS idx_taxes_created ON taxes (created_at DESC);

    -- 7. Loans
    CREATE INDEX IF NOT EXISTS idx_loans_provider ON loans (provider_id);
    CREATE INDEX IF NOT EXISTS idx_loans_status ON loans (status);
    CREATE INDEX IF NOT EXISTS idx_loans_deleted ON loans (is_deleted);
    CREATE INDEX IF NOT EXISTS idx_loans_created ON loans (created_at DESC);

    -- 8. Build Credit
    CREATE INDEX IF NOT EXISTS idx_build_credit_provider ON build_credit (provider_id);
    CREATE INDEX IF NOT EXISTS idx_build_credit_status ON build_credit (status);
    CREATE INDEX IF NOT EXISTS idx_build_credit_deleted ON build_credit (is_deleted);
    CREATE INDEX IF NOT EXISTS idx_build_credit_created ON build_credit (created_at DESC);

    -- 9. Housing
    CREATE INDEX IF NOT EXISTS idx_housing_provider ON housing (provider_id);
    CREATE INDEX IF NOT EXISTS idx_housing_status ON housing (status);
    CREATE INDEX IF NOT EXISTS idx_housing_deleted ON housing (is_deleted);
    CREATE INDEX IF NOT EXISTS idx_housing_created ON housing (created_at DESC);

    -- 10. Forex
    CREATE INDEX IF NOT EXISTS idx_forex_provider ON forex (provider_id);
    CREATE INDEX IF NOT EXISTS idx_forex_status ON forex (status);
    CREATE INDEX IF NOT EXISTS idx_forex_deleted ON forex (is_deleted);
    CREATE INDEX IF NOT EXISTS idx_forex_created ON forex (created_at DESC);

    -- 11. Employment
    CREATE INDEX IF NOT EXISTS idx_employment_provider ON employment (provider_id);
    CREATE INDEX IF NOT EXISTS idx_employment_status ON employment (status);
    CREATE INDEX IF NOT EXISTS idx_employment_deleted ON employment (is_deleted);
    CREATE INDEX IF NOT EXISTS idx_employment_created ON employment (created_at DESC);

    -- 12. Food
    CREATE INDEX IF NOT EXISTS idx_food_provider ON food (provider_id);
    CREATE INDEX IF NOT EXISTS idx_food_status ON food (status);
    CREATE INDEX IF NOT EXISTS idx_food_deleted ON food (is_deleted);
    CREATE INDEX IF NOT EXISTS idx_food_created ON food (created_at DESC);

    -- 13. Courses
    CREATE INDEX IF NOT EXISTS idx_courses_provider ON courses (provider_id);
    CREATE INDEX IF NOT EXISTS idx_courses_status ON courses (status);
    CREATE INDEX IF NOT EXISTS idx_courses_deleted ON courses (is_deleted);
    CREATE INDEX IF NOT EXISTS idx_courses_created ON courses (created_at DESC);
  `);
  logger.info("Strategic performance indexes applied successfully.");
}

async function initStatusHistory() {
  await DB.raw(`
    CREATE TABLE IF NOT EXISTS status_history (
      id SERIAL PRIMARY KEY,
      student_db_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
      stage VARCHAR(100) NOT NULL,
      sub_status VARCHAR(255),
      notes TEXT,
      changed_by VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    ALTER TABLE status_history ADD COLUMN IF NOT EXISTS student_db_id INTEGER REFERENCES students(id) ON DELETE CASCADE;

    CREATE INDEX IF NOT EXISTS idx_status_history_student ON status_history (student_db_id);
    CREATE INDEX IF NOT EXISTS idx_status_history_created ON status_history (created_at DESC);
  `);
}
import { initializeReportsTable } from "@/reporting/models/reports.schema";

async function initDocuments() {
  await DB.raw(`
    CREATE TABLE IF NOT EXISTS documents (
      id SERIAL PRIMARY KEY,
      student_db_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100),
      status VARCHAR(50) DEFAULT 'active',
      file_type VARCHAR(255),
      file_size BIGINT,
      uploaded_by VARCHAR(255),
      file_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Ensure indexes for fast lookups
    CREATE INDEX IF NOT EXISTS idx_documents_student ON documents (student_db_id);
    CREATE INDEX IF NOT EXISTS idx_documents_category ON documents (category);

    -- Safety: Alter existing columns if they were created with VARCHAR(50)
    ALTER TABLE documents ALTER COLUMN file_type TYPE VARCHAR(255);
    ALTER TABLE documents ALTER COLUMN file_url TYPE TEXT;
    ALTER TABLE documents ALTER COLUMN name TYPE VARCHAR(255);
    ALTER TABLE documents ALTER COLUMN uploaded_by TYPE VARCHAR(255);
    ALTER TABLE documents ALTER COLUMN category TYPE VARCHAR(100);
  `);
}

async function initReporting() {
  await initializeReportsTable();
}
