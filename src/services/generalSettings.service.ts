import DB from '@/database';
import { logger } from '@/utils/logger';

export interface GeneralSetting {
  id: number;
  key: string;
  value: string;
  group_name: string;
  updated_at: Date;
}

class GeneralSettingsService {
  public async getAll(): Promise<GeneralSetting[]> {
    const settings = await DB.raw('SELECT * FROM general_settings ORDER BY key ASC');
    return settings.rows;
  }

  public async getByKey(key: string): Promise<GeneralSetting | null> {
    const setting = await DB.raw('SELECT * FROM general_settings WHERE key = $1', [key]);
    return setting.rows[0] || null;
  }

  public async upsert(key: string, value: string, group_name: string = 'general'): Promise<GeneralSetting> {
    const query = `
      INSERT INTO general_settings (key, value, group_name, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT (key) DO UPDATE
      SET value = EXCLUDED.value,
          group_name = EXCLUDED.group_name,
          updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const result = await DB.raw(query, [key, value, group_name]);
    return result.rows[0];
  }

  public async bulkUpdate(settings: { key: string; value: string; group_name?: string }[]): Promise<GeneralSetting[]> {
    return await DB.transaction(async trx => {
      const results: GeneralSetting[] = [];
      for (const s of settings) {
        const query = `
          INSERT INTO general_settings (key, value, group_name, updated_at)
          VALUES (?, ?, ?, CURRENT_TIMESTAMP)
          ON CONFLICT (key) DO UPDATE
          SET value = EXCLUDED.value,
              group_name = EXCLUDED.group_name,
              updated_at = CURRENT_TIMESTAMP
          RETURNING *
        `;
        const res = await trx.raw(query, [s.key, s.value, s.group_name || 'general']);
        results.push(res.rows[0]);
      }
      return results;
    });
  }
}

export default GeneralSettingsService;
