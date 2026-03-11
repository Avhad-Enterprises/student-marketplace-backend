import DB from '@/database';
import { AITestPlansSettings } from '@/interfaces/aiTestPlans.interface';

class AiTestPlansService {
    public async getSettings(): Promise<AITestPlansSettings> {
        const settings: AITestPlansSettings = await DB('ai_test_plans_settings').first();
        return settings;
    }

    public async updateSettings(settingsData: AITestPlansSettings): Promise<AITestPlansSettings> {
        const existing = await DB('ai_test_plans_settings').first();

        const dataToSave = {
            ...settingsData,
            custom_intensity: typeof settingsData.custom_intensity === 'object' ? JSON.stringify(settingsData.custom_intensity) : settingsData.custom_intensity,
            readiness_weights: typeof settingsData.readiness_weights === 'object' ? JSON.stringify(settingsData.readiness_weights) : settingsData.readiness_weights,
            updated_at: new Date()
        };

        if (existing) {
            await DB('ai_test_plans_settings').where({ id: existing.id }).update(dataToSave);
        } else {
            await DB('ai_test_plans_settings').insert(dataToSave);
        }

        return this.getSettings();
    }
}

export default AiTestPlansService;
