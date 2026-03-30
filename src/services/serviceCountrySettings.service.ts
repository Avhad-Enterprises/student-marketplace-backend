import DB from '@/database';
import { ServiceCountrySettings } from '@/interfaces/serviceCountrySettings.interface';
import { logger } from '@/utils/logger';

class ServiceCountrySettingsService {
    public async getSettings(): Promise<ServiceCountrySettings> {
        const settings: any = await DB('service_country_settings').first();
        
        if (!settings) {
            // Return defaults if no settings exist yet
            return {
                enable_service_activation_by_country: true,
                default_active_services: ['Visa Counseling', 'Loan Assistance', 'Insurance'],
                auto_enable_new_services: true,
                allow_service_customization_by_country: true,
                service_visibility_mode: 'Country-based',
                default_destination_country: 'United States',
                default_currency_per_country: 'USD',
                default_visa_type_per_country: 'F-1 Student Visa',
                default_intake_mapping: 'Fall',
                risk_category_per_country: 'Medium Risk',
                auto_escalation_high_risk: true,
                default_university_status: 'Active',
                ranking_source_type: 'QS World University Rankings',
                default_comparison_weight: 50,
                auto_approve_listed_universities: false,
                allow_manual_ranking_override: true,
                default_app_deadline_buffer: 30,
                auto_assign_counselor_on_activation: true,
                require_doc_before_service_activation: true,
                allow_multi_service_parallel: true
            };
        }

        // Parse JSON fields
        if (typeof settings.default_active_services === 'string') {
            try {
                settings.default_active_services = JSON.parse(settings.default_active_services);
            } catch (e) {
                settings.default_active_services = [];
            }
        }

        return settings;
    }

    public async updateSettings(settingsData: Partial<ServiceCountrySettings>): Promise<ServiceCountrySettings> {
        const { id, created_at, updated_at, ...cleanData } = settingsData as any;

        // Serialization
        if (cleanData.default_active_services && Array.isArray(cleanData.default_active_services)) {
            cleanData.default_active_services = JSON.stringify(cleanData.default_active_services);
        }

        const existing = await DB('service_country_settings').first();
        const dataToSave = {
            ...cleanData,
            updated_at: new Date()
        };

        if (existing) {
            await DB('service_country_settings').where({ id: existing.id }).update(dataToSave);
        } else {
            await DB('service_country_settings').insert(dataToSave);
        }

        return this.getSettings();
    }
}

export default ServiceCountrySettingsService;
