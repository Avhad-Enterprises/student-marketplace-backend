import DB from '@/database';
import { SystemSettings, NotificationSetting } from '@/interfaces/systemSettings.interface';
import { logger } from '@/utils/logger';

class SystemSettingsService {
    public async getSystemSettings(): Promise<SystemSettings> {
        const settings: any = await DB('system_settings').first();
        if (!settings) {
            return {
                platform_name: 'Student Marketplace',
                support_email: 'support@studentmarketplace.com',
                primary_currency: 'USD'
            };
        }

        // Parse JSON fields if they are strings
        if (typeof settings.document_access_roles === 'string') {
            try { settings.document_access_roles = JSON.parse(settings.document_access_roles); } catch (e) { settings.document_access_roles = []; }
        }
        if (typeof settings.kyc_document_types === 'string') {
            try { settings.kyc_document_types = JSON.parse(settings.kyc_document_types); } catch (e) { settings.kyc_document_types = []; }
        }
        if (typeof settings.default_active_services === 'string') {
            try { settings.default_active_services = JSON.parse(settings.default_active_services); } catch (e) { settings.default_active_services = []; }
        }
        if (typeof settings.feature_flags === 'string') {
            try { settings.feature_flags = JSON.parse(settings.feature_flags); } catch (e) { settings.feature_flags = {}; }
        }

        return settings;
    }

    public async updateSystemSettings(settingsData: Partial<SystemSettings>): Promise<SystemSettings> {
        // Strip out read-only fields that might be coming from the frontend
        const { id, created_at, updated_at, ...cleanData } = settingsData as any;
        
        // Handle serialization of JSON fields
        if (cleanData.document_access_roles && Array.isArray(cleanData.document_access_roles)) {
            cleanData.document_access_roles = JSON.stringify(cleanData.document_access_roles);
        }
        if (cleanData.kyc_document_types && Array.isArray(cleanData.kyc_document_types)) {
            cleanData.kyc_document_types = JSON.stringify(cleanData.kyc_document_types);
        }
        if (cleanData.default_active_services && Array.isArray(cleanData.default_active_services)) {
            cleanData.default_active_services = JSON.stringify(cleanData.default_active_services);
        }
        if (cleanData.feature_flags && typeof cleanData.feature_flags === 'object') {
            cleanData.feature_flags = JSON.stringify(cleanData.feature_flags);
        }

        const existing = await DB('system_settings').first();
        const dataToSave = {
            ...cleanData,
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
