import { AiVisaSettings } from '@/interfaces/aiVisaSettings.interface';
import DB from '@/database';
import { Tables } from '@/database/tables';

class AiVisaSettingsService {
  public async getSettings(): Promise<AiVisaSettings> {
    const settings: AiVisaSettings = await DB(Tables.AI_VISA_SETTINGS).first();
    if (!settings) {
      return {
        enable_ai_assistant: true,
        ai_mode: 'Balanced',
        risk_sensitivity: 'Medium',
        confidence_threshold: 60,
        escalation_threshold: 60,
        prompt_template: 'Analyze the student profile and provide a comprehensive visa assessment. Consider academic background, financial situation, English proficiency, work experience, and destination country requirements. Provide recommendations for countries with the highest visa success probability.',
        allow_country_injection: true,
        allow_document_injection: true,
        allow_financial_injection: false,
        enable_response_explanations: true,
        block_unverified_data: true,
        require_manual_review: true,
        log_decisions: true,
        enable_audit_trail: true,
        require_human_approval: false,
      };
    }
    return settings;
  }

  public async updateSettings(settingsData: Partial<AiVisaSettings>): Promise<AiVisaSettings> {
    const existing = await DB(Tables.AI_VISA_SETTINGS).first();
    
    const dataToSave = {
      ...settingsData,
      updated_at: new Date(),
    };

    if (existing) {
      await DB(Tables.AI_VISA_SETTINGS).where({ id: existing.id }).update(dataToSave);
    } else {
      await DB(Tables.AI_VISA_SETTINGS).insert(dataToSave);
    }

    return this.getSettings();
  }
}

export default AiVisaSettingsService;
