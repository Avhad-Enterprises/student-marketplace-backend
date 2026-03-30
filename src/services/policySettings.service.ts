import DB from '@/database';
import { PolicyGlobalSettings, PolicyPage } from '@/interfaces/policySettings.interface';

class PolicySettingsService {
    // 1. Global settings (singleton)
    public async getGlobalSettings(): Promise<PolicyGlobalSettings> {
        const settings: any = await DB('policy_global_settings').first();
        if (!settings) {
            return {
                enable_reacceptance: true,
                enable_consent_timestamp: true,
                log_retention_months: 24,
                legal_contact_email: 'legal@example.com'
            };
        }
        return settings;
    }

    public async updateGlobalSettings(settingsData: Partial<PolicyGlobalSettings>): Promise<PolicyGlobalSettings> {
        const { id, created_at, updated_at, ...cleanData } = settingsData as any;
        const existing = await DB('policy_global_settings').first();
        if (existing) {
            await DB('policy_global_settings').where({ id: existing.id }).update({ ...cleanData, updated_at: new Date() });
        } else {
            await DB('policy_global_settings').insert(cleanData);
        }
        return this.getGlobalSettings();
    }

    // 2. Policy Pages CRUD
    public async getAllPolicyPages(): Promise<PolicyPage[]> {
        return await DB('policy_pages').orderBy('id', 'asc');
    }

    public async getPolicyPageById(id: number): Promise<PolicyPage> {
        return await DB('policy_pages').where({ id }).first();
    }

    public async createPolicyPage(pageData: Partial<PolicyPage>): Promise<PolicyPage> {
        const [id] = await DB('policy_pages').insert(pageData).returning('id');
        return this.getPolicyPageById(id.id || id);
    }

    public async updatePolicyPage(id: number, pageData: Partial<PolicyPage>): Promise<PolicyPage> {
        const { id: _, created_at, updated_at, ...cleanData } = pageData as any;
        await DB('policy_pages').where({ id }).update({ ...cleanData, updated_at: new Date() });
        return this.getPolicyPageById(id);
    }

    public async deletePolicyPage(id: number): Promise<boolean> {
        const count = await DB('policy_pages').where({ id }).delete();
        return count > 0;
    }
}

export default PolicySettingsService;
