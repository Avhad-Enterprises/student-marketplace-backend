import db from '../database/db';

export interface CommunicationSettings {
  id: number;
  event_id: number | null;
  default_sender_name?: string;
  reply_to_email?: string;
  sms_sender_id?: string;
  global_kill_switch: boolean;
  email_enabled: boolean;
  sms_enabled: boolean;
  whatsapp_enabled: boolean;
  default_timezone: string;
  default_language: string;
  auto_append_footer: boolean;
  auto_append_unsubscribe: boolean;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  daily_send_limit: number;
  campaign_throttling: boolean;
  approval_required: boolean;
  approval_level: string;
  auto_approve_system: boolean;
  approval_sla: number;
  gdpr_consent_required: boolean;
  auto_suppress_on_bounce: boolean;
  proof_of_consent_storage: boolean;
  opt_out_enabled: boolean;
  track_opens: boolean;
  track_clicks: boolean;
  unsubscribe_page_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateSettingsInput {
  default_sender_name?: string;
  reply_to_email?: string;
  sms_sender_id?: string;
  global_kill_switch?: boolean;
  email_enabled?: boolean;
  sms_enabled?: boolean;
  whatsapp_enabled?: boolean;
  default_timezone?: string;
  default_language?: string;
  auto_append_footer?: boolean;
  auto_append_unsubscribe?: boolean;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  daily_send_limit?: number;
  campaign_throttling?: boolean;
  approval_required?: boolean;
  approval_level?: string;
  auto_approve_system?: boolean;
  approval_sla?: number;
  gdpr_consent_required?: boolean;
  auto_suppress_on_bounce?: boolean;
  proof_of_consent_storage?: boolean;
  opt_out_enabled?: boolean;
  track_opens?: boolean;
  track_clicks?: boolean;
  unsubscribe_page_url?: string;
}

export interface SettingsValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export class CommunicationSettingsService {
  // Get settings for an event
  async getSettings(eventId?: number | null): Promise<CommunicationSettings> {
    const effectiveEventId = (eventId === 0 || !eventId) ? null : eventId;

    if (effectiveEventId) {
      const eventSettings = await db('communication_settings').where('event_id', effectiveEventId).first();
      if (eventSettings) return eventSettings;
    }

    let globalSettings = await db('communication_settings').whereNull('event_id').first();
    if (!globalSettings) {
      [globalSettings] = await db('communication_settings')
        .insert({
          event_id: null,
          email_enabled: true,
          sms_enabled: false,
          whatsapp_enabled: false,
          global_kill_switch: false,
          default_timezone: 'Europe/London',
          default_language: 'en',
          auto_append_footer: true,
          auto_append_unsubscribe: true,
          daily_send_limit: 500,
          campaign_throttling: true,
          approval_required: false,
          approval_level: 'single',
          auto_approve_system: true,
          approval_sla: 24,
          gdpr_consent_required: true,
          auto_suppress_on_bounce: true,
          proof_of_consent_storage: true,
          opt_out_enabled: true,
          track_opens: true,
          track_clicks: true,
        })
        .returning('*');
    }
    return globalSettings;
  }

  // Update settings
  async updateSettings(eventId: number | null | undefined, input: UpdateSettingsInput): Promise<CommunicationSettings> {
    const effectiveEventId = (eventId === 0 || !eventId) ? null : eventId;
    let existingRecord;
    if (effectiveEventId === null) existingRecord = await db('communication_settings').whereNull('event_id').first();
    else existingRecord = await db('communication_settings').where('event_id', effectiveEventId).first();

    const updateData: any = { ...input, updated_at: db.fn.now() };

    if (existingRecord) {
      const [updated] = await db('communication_settings').where('id', existingRecord.id).update(updateData).returning('*');
      return updated;
    } else {
      const [inserted] = await db('communication_settings').insert({ ...updateData, event_id: effectiveEventId }).returning('*');
      return inserted;
    }
  }

  // Validate settings
  async validateSettings(eventId?: number | null, channel?: 'email' | 'sms'): Promise<SettingsValidationResult> {
    const settings = await this.getSettings(eventId);
    const errors: string[] = [];
    const warnings: string[] = [];
    if (channel === 'email' && !settings.email_enabled) errors.push('Email channel is disabled');
    if (channel === 'sms' && !settings.sms_enabled) errors.push('SMS channel is disabled');
    return { valid: errors.length === 0, errors, warnings };
  }

  // Check quiet hours
  async isInQuietHours(eventId?: number | null): Promise<any> {
    const settings = await this.getSettings(eventId);
    if (!settings.quiet_hours_start || !settings.quiet_hours_end) return { inQuietHours: false };
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const inQuietHours = currentTime >= settings.quiet_hours_start && currentTime <= settings.quiet_hours_end;
    return { inQuietHours, startTime: settings.quiet_hours_start, endTime: settings.quiet_hours_end };
  }

  // Reset settings
  async resetSettings(eventId?: number | null): Promise<CommunicationSettings> {
    const effectiveEventId = (eventId === 0 || !eventId) ? null : eventId;
    const query = db('communication_settings');
    if (effectiveEventId === null) query.whereNull('event_id');
    else query.where('event_id', effectiveEventId);
    const [updated] = await query.update({ email_enabled: true, sms_enabled: false, updated_at: db.fn.now() }).returning('*');
    return updated;
  }
}
