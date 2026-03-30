import { DeliverySafetySettings } from '@/interfaces/deliverySafetySettings.interface';
import DB from '@/database';
import { Tables } from '@/database/tables';

class DeliverySafetySettingsService {
  public async getSettings(): Promise<DeliverySafetySettings> {
    const settings: DeliverySafetySettings = await DB(Tables.DELIVERY_SAFETY_SETTINGS).first();
    if (!settings) {
      return {
        api_requests_per_minute: 100,
        login_attempts_per_hour: 5,
        booking_creation_limit_per_user: 10,
        form_submissions_per_ip: 20,
        file_upload_limit_mb: 50,
        enable_captcha: true,
        block_tor_nodes: false,
        honeypot_enabled: true,
        pii_masking: true,
        auto_deletion_days: 365,
        mfa_required: false,
        session_concurrency: 3,
        real_time_alerts: true,
        security_logs_retention_days: 90,
        block_disposable_emails: true,
        auto_block_failed_logins: true,
        auto_flag_suspicious: true,
        suspicious_threshold_count: 3,
        auto_lock_duration_mins: 30,
        auto_delete_inactive_days: 730,
        encrypt_documents: true,
        session_timeout_mins: 30,
        password_reset_days: 90,
        allow_multiple_sessions: false,
        ip_whitelist: '',
        enable_activity_logging: true,
        enable_admin_logs: true,
        enable_ip_tracking: true,
        enable_ai_logs: true,
      };
    }
    return settings;
  }

  public async updateSettings(settingsData: Partial<DeliverySafetySettings>): Promise<DeliverySafetySettings> {
    const existing = await DB(Tables.DELIVERY_SAFETY_SETTINGS).first();
    
    const dataToSave = {
      ...settingsData,
      updated_at: new Date(),
    };

    // Remove undefined fields
    Object.keys(dataToSave).forEach(key => (dataToSave as any)[key] === undefined && delete (dataToSave as any)[key]);

    if (existing) {
      await DB(Tables.DELIVERY_SAFETY_SETTINGS).where({ id: existing.id }).update(dataToSave);
    } else {
      await DB(Tables.DELIVERY_SAFETY_SETTINGS).insert(dataToSave);
    }

    return this.getSettings();
  }
}

export default DeliverySafetySettingsService;
