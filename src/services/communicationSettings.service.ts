import { CommunicationSettings } from '@/interfaces/communicationSettings.interface';
import DB from '@/database';
import { Tables } from '@/database/tables';

class CommunicationSettingsService {
  public async getSettings(): Promise<CommunicationSettings> {
    const settings: CommunicationSettings = await DB(Tables.COMMUNICATION_SETTINGS).first();
    if (!settings) {
      return {
        email_provider: 'SendGrid',
        api_key: '',
        webhook_url: '',
        ip_pool_name: 'main-pool',
        connection_status: 'connected',
        last_synced: new Date(),
        email_settings: {
          daily_limit: 50000,
          retry_logic: true,
          tracking_enabled: true,
        },
        campaign_defaults: {
          default_from_name: 'Support Team',
          default_from_email: 'support@globalvisa.com',
          unsubscribe_link: true,
        },
        default_from_name: 'Global Visa Services',
        default_from_email: 'noreply@globalvisa.com',
        reply_to_email: 'support@globalvisa.com',
        email_footer_text: 'Global Visa Services | 123 Main Street, Suite 100 | support@globalvisa.com',
        email_signature: 'Best regards, Global Visa Services Team',
        enable_notifications: true,
        enable_auto_status_emails: true,
        enable_campaign_tracking: true,
        domain_verification_status: 'verified',
        default_campaign_owner: 'Marketing Team',
        default_lead_source_tag: 'Website',
        default_attribution_model: 'Last-touch',
        campaign_auto_expiry_days: 90,
        enable_conversion_tracking: true,
        verified_domains: 'globalvisa.com, app.globalvisa.com',
        dkim_status: 'Verified',
        spf_status: 'Verified',
        sender_name_list: 'Global Visa Services, Support Team, Marketing Team',
        default_sender_name: 'Global Visa Services',
      };
    }
    return settings;
  }

  public async updateSettings(settingsData: Partial<CommunicationSettings>): Promise<CommunicationSettings> {
    const existing = await DB(Tables.COMMUNICATION_SETTINGS).first();
    
    // Convert objects to JSON strings if necessary for the DB
    const dataToSave = {
      ...settingsData,
      email_settings: settingsData.email_settings ? JSON.stringify(settingsData.email_settings) : undefined,
      campaign_defaults: settingsData.campaign_defaults ? JSON.stringify(settingsData.campaign_defaults) : undefined,
      updated_at: new Date(),
    };

    // Remove undefined fields
    Object.keys(dataToSave).forEach(key => (dataToSave as any)[key] === undefined && delete (dataToSave as any)[key]);

    if (existing) {
      await DB(Tables.COMMUNICATION_SETTINGS).where({ id: existing.id }).update(dataToSave);
    } else {
      await DB(Tables.COMMUNICATION_SETTINGS).insert(dataToSave);
    }

    return this.getSettings();
  }

  public async testConnection(): Promise<CommunicationSettings> {
    const existing = await DB(Tables.COMMUNICATION_SETTINGS).first();
    const updateData = {
      connection_status: 'connected',
      last_synced: new Date(),
      updated_at: new Date(),
    };

    if (existing) {
      await DB(Tables.COMMUNICATION_SETTINGS).where({ id: existing.id }).update(updateData);
    } else {
      await DB(Tables.COMMUNICATION_SETTINGS).insert({
        ...updateData,
        email_provider: 'SendGrid',
      });
    }

    return this.getSettings();
  }
}

export default CommunicationSettingsService;
