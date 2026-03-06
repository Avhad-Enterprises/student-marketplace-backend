import DB from '@/database';
import { SystemSettings, NotificationSetting } from '@/interfaces/systemSettings.interface';
import { logger } from '@/utils/logger';

class SystemSettingsService {
    public async getSystemSettings(): Promise<SystemSettings> {
        const settings: SystemSettings = await DB('system_settings').first();
        if (!settings) {
            return {
                platform_name: 'Student Marketplace',
                support_email: 'support@studentmarketplace.com',
                primary_currency: 'USD'
            };
        }
        return settings;
    }

    public async updateSystemSettings(settingsData: Partial<SystemSettings>): Promise<SystemSettings> {
        const existing = await DB('system_settings').first();
        const dataToSave = {
            ...settingsData,
            updated_at: new Date()
        };

        if (existing) {
            await DB('system_settings').where({ id: existing.id }).update(dataToSave);
        } else {
            await DB('system_settings').insert(dataToSave);
        }

        return this.getSystemSettings();
    }

    public async getNotificationSettings(): Promise<NotificationSetting[]> {
        return DB('notification_settings').select('*').orderBy('id', 'asc');
    }

    public async updateNotificationSetting(key: string, enabled: boolean): Promise<NotificationSetting> {
        await DB('notification_settings')
            .where({ key })
            .update({ enabled, updated_at: new Date() });

        return DB('notification_settings').where({ key }).first();
    }
}

export default SystemSettingsService;
