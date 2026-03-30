import DB from '@/database';
import { ComplianceSettings } from '@/interfaces/complianceSettings.interface';

class ComplianceSettingsService {
    public async getSettings(): Promise<ComplianceSettings> {
        const settings: any = await DB('compliance_settings').first();
        if (!settings) {
            return {
                gdpr_mode: true,
                ccpa_mode: false,
                right_to_be_forgotten: true,
                data_portability: true,
                data_retention_period: 365,
                anonymize_deleted: true,
                require_explicit_consent: true,
                cookie_consent: true,
                marketing_opt_in: true,
                age_verification_required: false,
                privacy_policy_url: 'https://example.com/privacy',
                minimum_age: 16,
                document_encryption: true,
                document_watermarking: false,
                version_control: true,
                compliance_tagging: true,
                document_retention_years: 7,
                automatic_expiry: true,
                enable_audit_logging: true,
                log_data_access: true,
                log_data_modifications: true,
                log_user_authentication: true,
                audit_log_retention_days: 730,
                real_time_alerts: true,
                primary_framework: 'GDPR (European Union)',
                data_residency: 'European Union',
                soc2_compliance: false,
                iso27001_compliance: false,
                hipaa_compliance: false,
            };
        }
        return settings;
    }

    public async updateSettings(settingsData: Partial<ComplianceSettings>): Promise<ComplianceSettings> {
        const { id, created_at, updated_at, ...cleanData } = settingsData as any;
        
        const existing = await DB('compliance_settings').first();
        const dataToSave = {
            ...cleanData,
            updated_at: new Date()
        };

        if (existing) {
            await DB('compliance_settings').where({ id: existing.id }).update(dataToSave);
        } else {
            await DB('compliance_settings').insert(dataToSave);
        }

        return this.getSettings();
    }
}

export default ComplianceSettingsService;
