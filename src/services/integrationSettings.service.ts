import DB from '@/database';
import { IntegrationSettings } from '@/interfaces/integrationSettings.interface';

class IntegrationSettingsService {
    public async getSettings(): Promise<IntegrationSettings> {
        const settings: any = await DB('integration_settings').first();
        if (!settings) {
            return {
                enable_public_api: true,
                api_key: 'sk_test_51Mz...',
                api_key_rotation: 'Manual',
                api_key_expiry_days: 90,
                api_rate_limit: 1000,
                allowed_ip_whitelist: '192.168.1.1, 10.0.0.1',
                enable_webhooks: true,
                webhook_endpoint_url: 'https://api.example.com/webhooks',
                webhook_secret_key: 'whsec_...',
                webhook_retry_policy: 'Exponential Backoff',
                webhook_events: '["Student Created", "Payment Completed"]',
                integration_provider: 'Stripe',
                integration_credentials: '',
                ai_service_provider: 'OpenAI GPT-4',
                file_storage_provider: 'AWS S3',
                search_engine_provider: 'Elasticsearch',
                notification_service_provider: 'SendGrid',
                allow_csv_import: true,
                allow_bulk_data_export: true,
                enable_scheduled_data_sync: false,
                export_format: 'CSV',
            };
        }
        return settings;
    }

    public async updateSettings(settingsData: Partial<IntegrationSettings>): Promise<IntegrationSettings> {
        const { id, created_at, updated_at, ...cleanData } = settingsData as any;
        
        const existing = await DB('integration_settings').first();
        const dataToSave = {
            ...cleanData,
            updated_at: new Date()
        };

        if (existing) {
            await DB('integration_settings').where({ id: existing.id }).update(dataToSave);
        } else {
            await DB('integration_settings').insert(dataToSave);
        }

        return this.getSettings();
    }
}

export default IntegrationSettingsService;
