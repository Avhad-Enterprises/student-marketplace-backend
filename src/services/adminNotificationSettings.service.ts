import DB from '@/database';
import { AdminNotificationSettings } from '@/interfaces/adminNotificationSettings.interface';

class AdminNotificationSettingsService {
    public async getSettings(): Promise<AdminNotificationSettings> {
        const settings: any = await DB('admin_notification_settings').first();
        if (!settings) {
            return {
                alert_high_risk_student: true,
                alert_visa_rejection: true,
                alert_payment_failure: true,
                alert_expert_over_capacity: true,
                alert_recipient_roles: ['Admin', 'Manager'],
                enable_student_email_notifications: true,
                enable_booking_reminders: true,
                enable_deadline_reminders: true,
                enable_invoice_reminders: true,
                escalate_lead_hours: 24,
                escalate_booking_hours: 48,
                escalation_role: 'Senior Manager',
                escalation_email: 'escalation@company.com',
                channel_email: true,
                channel_sms: false,
                channel_in_app: true,
            };
        }

        // Parse JSON field
        if (typeof settings.alert_recipient_roles === 'string') {
            try { settings.alert_recipient_roles = JSON.parse(settings.alert_recipient_roles); } catch (e) { settings.alert_recipient_roles = []; }
        }

        return settings;
    }

    public async updateSettings(settingsData: Partial<AdminNotificationSettings>): Promise<AdminNotificationSettings> {
        const { id, created_at, updated_at, ...cleanData } = settingsData as any;
        
        // Handle serialization
        if (cleanData.alert_recipient_roles && Array.isArray(cleanData.alert_recipient_roles)) {
            cleanData.alert_recipient_roles = JSON.stringify(cleanData.alert_recipient_roles);
        }

        const existing = await DB('admin_notification_settings').first();
        const dataToSave = {
            ...cleanData,
            updated_at: new Date()
        };

        if (existing) {
            await DB('admin_notification_settings').where({ id: existing.id }).update(dataToSave);
        } else {
            await DB('admin_notification_settings').insert(dataToSave);
        }

        return this.getSettings();
    }
}

export default AdminNotificationSettingsService;
