import DB from '@/database';
import { LocalizationSettings } from '@/interfaces/localizationSettings.interface';

class LocalizationSettingsService {
    public async getSettings(): Promise<LocalizationSettings> {
        const settings: any = await DB('localization_settings').first();
        if (!settings) {
            return {
                default_language: 'English',
                fallback_language: 'English',
                enable_multi_language: true,
                auto_detect_language: true,
                enable_rtl_support: false,
                supported_languages: '["English", "Spanish", "French"]',
                default_timezone: 'UTC',
                date_format: 'MM/DD/YYYY (US)',
                time_format: '12-hour (1:30 PM)',
                first_day_of_week: 'Sunday',
                auto_timezone_detection: true,
                primary_region: 'North America',
                region_based_pricing: false,
                region_based_content: true,
                regional_compliance_mode: true,
                operating_regions: '["North America", "Europe"]',
                number_format: 'US (1,234.56)',
                phone_number_format: 'International (+1-555-123-4567)',
                address_format: 'US Format',
                name_format: 'First Last (Western)',
                decimal_separator: 'Period (.)',
                thousands_separator: 'Comma (,)',
            };
        }
        return settings;
    }

    public async updateSettings(settingsData: Partial<LocalizationSettings>): Promise<LocalizationSettings> {
        const { id, created_at, updated_at, ...cleanData } = settingsData as any;
        
        const existing = await DB('localization_settings').first();
        const dataToSave = {
            ...cleanData,
            updated_at: new Date()
        };

        if (existing) {
            await DB('localization_settings').where({ id: existing.id }).update(dataToSave);
        } else {
            await DB('localization_settings').insert(dataToSave);
        }

        return this.getSettings();
    }
}

export default LocalizationSettingsService;
