export interface SystemSettings {
    id?: number;
    platform_name: string;
    support_email: string;
    primary_currency: string;
    
    // Business Details
    legal_entity_name?: string;
    organization_type?: string;
    support_phone?: string;
    timezone?: string;
    registered_address?: string;
    tax_id?: string;
    registration_number?: string;
    country_of_registration?: string;
    
    // Branding
    logo_light?: string;
    logo_dark?: string;
    favicon?: string;
    primary_color?: string;
    accent_color?: string;
    email_logo?: string;
    
    // Domain & Environment
    primary_domain?: string;
    subdomain?: string;
    staging_domain?: string;
    environment?: string;
    maintenance_mode?: boolean;
    
    // Preferences
    invoice_footer?: string;
    multi_country_mode?: boolean;
    multi_service_mode?: boolean;
    allow_guest_enquiries?: boolean;
    require_email_verification?: boolean;
    require_phone_verification?: boolean;
    
    // Security Rules
    password_min_length?: number;
    force_password_reset_days?: number;
    session_timeout_minutes?: number;
    require_special_chars?: boolean;
    two_factor_required?: boolean;
    ip_whitelist?: string;

    // Login Policies
    max_login_attempts?: number;
    lockout_duration_minutes?: number;
    allow_concurrent_sessions?: boolean;
    enable_sso?: boolean;
    enable_google_login?: boolean;

    // People & Identity
    manual_admin_approval?: boolean;
    auto_approve_hours?: number;
    verification_expiry_days?: number;
    
    // Document Access Rules
    document_access_roles?: string; // JSON string array
    mask_sensitive_documents?: boolean;
    allow_document_download?: boolean;
    watermark_documents?: boolean;

    // KYC Settings
    kyc_required_booking?: boolean;
    kyc_required_loan?: boolean;
    kyc_required_visa?: boolean;
    kyc_document_types?: string; // JSON string array

    // Data Visibility
    hide_phone_from_experts?: boolean;
    hide_email_from_counselors?: boolean;
    allow_cross_department_access?: boolean;
    log_identity_changes?: boolean;
    
    // Service Availability Rules
    enable_service_activation_by_country?: boolean;
    default_active_services?: string; // JSON string array
    auto_enable_new_services?: boolean;
    allow_service_customization_by_country?: boolean;
    service_visibility_mode?: string;

    // Country Defaults
    default_destination_country?: string;
    default_currency_per_country?: string;
    default_visa_type_per_country?: string;
    default_intake_mapping?: string;
    risk_category_per_country?: string;
    auto_escalation_high_risk?: boolean;

    // University Defaults
    default_university_status?: string;
    ranking_source_type?: string;
    default_comparison_weight?: number;
    auto_approve_listed_universities?: boolean;
    allow_manual_ranking_override?: boolean;

    // Operational Defaults
    default_app_deadline_buffer?: number;
    auto_assign_counselor_on_activation?: boolean;
    require_doc_before_service_activation?: boolean;
    allow_multi_service_parallel?: boolean;

    // Advanced & System - Monitoring
    feature_flags?: Record<string, boolean>;
    api_logging_enabled?: boolean;
    query_logging_enabled?: boolean;
    system_log_retention_days?: number;
    
    // Figma Redesign: Audit & Monitoring
    enable_audit_logging?: boolean;
    enable_user_activity_logs?: boolean;
    enable_data_change_logs?: boolean;
    enable_login_activity_logs?: boolean;
    failed_login_threshold?: number;
    webhook_failure_threshold?: number;
    email_bounce_threshold?: number;

    // Figma Redesign: Security & Sessions
    enforce_2fa_admins?: boolean;
    password_complexity_rules?: boolean;
    password_expiry_days?: number;
    ip_allowlist?: string;

    // Figma Redesign: System Defaults & Limits
    global_rate_limit?: number;
    max_file_upload_mb?: number;
    max_concurrent_exports?: number;
    pagination_default_size?: number;

    // Figma Redesign: Backup & Recovery
    backup_frequency?: string;
    backup_retention_days?: number;

    // Feature Flags Expanded
    enable_beta_features?: boolean;
    environment_scope?: string;

    created_at?: Date;
    updated_at?: Date;
}

export interface NotificationSetting {
    id: number;
    key: string;
    title: string;
    description: string;
    enabled: boolean;
    type: 'email' | 'push';
    created_at: Date;
    updated_at: Date;
}
