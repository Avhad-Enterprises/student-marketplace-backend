export interface DeliverySafetySettings {
    id?: number;
    // Rate Limits
    api_requests_per_minute: number;
    login_attempts_per_hour: number;
    booking_creation_limit_per_user: number;
    form_submissions_per_ip: number;
    file_upload_limit_mb: number;
    // Abuse Prevention
    enable_captcha: boolean;
    block_tor_nodes: boolean;
    honeypot_enabled: boolean;
    // Data Protection
    pii_masking: boolean;
    auto_deletion_days: number;
    // Access Control
    mfa_required: boolean;
    session_concurrency: number;
    // Security Monitoring
    real_time_alerts: boolean;
    security_logs_retention_days: number;
    // New Abuse Prevention Fields from Figma
    block_disposable_emails: boolean;
    auto_block_failed_logins: boolean;
    auto_flag_suspicious: boolean;
    suspicious_threshold_count: number;
    auto_lock_duration_mins: number;
    // New Data Protection Fields from Figma
    auto_delete_inactive_days: number;
    encrypt_documents: boolean;
    // New Access Control Fields from Figma
    session_timeout_mins: number;
    password_reset_days: number;
    allow_multiple_sessions: boolean;
    ip_whitelist: string;
    // New Security Monitoring Fields from Figma
    enable_activity_logging: boolean;
    enable_admin_logs: boolean;
    enable_ip_tracking: boolean;
    enable_ai_logs: boolean;
    
    created_at?: Date;
    updated_at?: Date;
}
