import DB from '@/database';
import { Tables } from '@/database/tables';

class AiTestScoringService {
    public async getSettings() {
        const settings = await DB(Tables.AI_TEST_SCORING_SETTINGS).where({ id: 1 }).first();
        return settings;
    }

    public async updateSettings(settingsData: any) {
        const payload = {
            ...settingsData,
            reading_mapping: JSON.stringify(settingsData.reading_mapping),
            listening_mapping: JSON.stringify(settingsData.listening_mapping),
            writing_weights: JSON.stringify(settingsData.writing_weights),
            speaking_weights: JSON.stringify(settingsData.speaking_weights),
            updated_at: DB.fn.now(),
        };

        const existing = await this.getSettings();
        if (existing) {
            const updated = await DB(Tables.AI_TEST_SCORING_SETTINGS)
                .where({ id: 1 })
                .update(payload)
                .returning('*');
            return updated[0] || updated;
        } else {
            const inserted = await DB(Tables.AI_TEST_SCORING_SETTINGS)
                .insert({
                    id: 1,
                    ...payload,
                })
                .returning('*');
            return inserted[0] || inserted;
        }
    }
}

export default AiTestScoringService;
