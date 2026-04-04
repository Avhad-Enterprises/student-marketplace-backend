import db from '@/database';

export interface SendGridConfig {
  api_key: string;
  from_email: string;
  from_name?: string;
}

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  username?: string;
  password?: string;
  from_email: string;
  from_name?: string;
}

export interface IntegrationConfig {
  id: number;
  event_id: number | null;
  type: 'email' | 'sms' | 'whatsapp';
  provider: 'sendgrid' | 'smtp' | 'twilio' | 'vonage';
  is_enabled: boolean;
  config: SendGridConfig | SmtpConfig | any;
  created_at: string;
  updated_at: string;
}

export class IntegrationsService {
  /**
   * Get integration configuration for a specific type and event
   */
  async getConfig(type: 'email' | 'sms' | 'whatsapp', eventId?: number | null): Promise<IntegrationConfig | null> {
    const effectiveEventId = (eventId === 0 || !eventId) ? null : eventId;

    // Try to get event-specific config first
    if (effectiveEventId) {
      const eventConfig = await db('integration_configs')
        .where({
          event_id: effectiveEventId,
          type,
          is_enabled: true
        })
        .first();
      
      if (eventConfig) {
        return {
          ...eventConfig,
          config: typeof eventConfig.config === 'string' ? JSON.parse(eventConfig.config) : eventConfig.config
        };
      }
    }

    // Fallback to global config
    const globalConfig = await db('integration_configs')
      .where({
        event_id: null,
        type,
        is_enabled: true
      })
      .first();

    if (globalConfig) {
      return {
        ...globalConfig,
        config: typeof globalConfig.config === 'string' ? JSON.parse(globalConfig.config) : globalConfig.config
      };
    }

    // Default development fallback if nothing in DB
    if (process.env.NODE_ENV === 'development' && type === 'email') {
      return {
        id: 0,
        event_id: null,
        type: 'email',
        provider: 'smtp',
        is_enabled: true,
        config: {
          host: process.env.SMTP_HOST || 'localhost',
          port: parseInt(process.env.SMTP_PORT || '1025', 10),
          secure: false,
          from_email: 'noreply@studentmarketplace.com',
          from_name: 'Student Marketplace'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    return null;
  }
}
