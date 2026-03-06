import { AiAssistantSettings } from '@/interfaces/aiAssistant.interface';
import DB from '@/database';
import { logger } from '@/utils/logger';

class AiAssistantService {
    public async getSettings(): Promise<AiAssistantSettings> {
        const settings: AiAssistantSettings = await DB('ai_assistant_settings').first();
        if (!settings) {
            // Return default values if no settings found (though migration should handle initial seed if any)
            return {
                assistant_name: 'Study Abroad Visa Assistant',
                tagline: 'Your intelligent companion for visa guidance',
                default_language: 'en',
                model_provider: 'openai',
                model_version: 'gpt-4-turbo',
                temperature: 0.7,
                response_length: 'medium',
                memory_window: '8k',
                streaming: true,
                timeout: 30,
                retry_attempts: 3,
                tone: 'friendly',
                answer_style: 'detailed',
                communication_style: 'conversational',
                confidence_threshold: 60,
                confidence_visibility: 'internal',
                escalation_action: 'show-button',
                welcome_message: "Hello! I'm your Study Abroad Visa Assistant. How can I help you today?",
                guardrails: {
                    noLegalAdvice: true,
                    noGuaranteedApproval: true,
                    noFinancialGuarantee: true,
                    noImmigrationConsultancy: true,
                    noPolicyInterpretation: true
                },
                escalation_triggers: {
                    lowConfidence: true,
                    userRequestsHuman: true,
                    cannotAnswer: true,
                    negativeSentiment: true
                },
                formatting_rules: {
                    alwaysDisclaimer: true,
                    showChecklistTable: true,
                    countryLinks: true,
                    estimatedTime: true,
                    ctaButton: true
                },
                status: 'online',
                strict_mode: true
            };
        }
        return settings;
    }

    public async updateSettings(settingsData: AiAssistantSettings): Promise<AiAssistantSettings> {
        const existing: AiAssistantSettings = await DB('ai_assistant_settings').first();

        // Stringify JSON fields if they are objects (Knex might or might not handle it depending on DB client)
        const dataToSave = {
            ...settingsData,
            guardrails: typeof settingsData.guardrails === 'object' ? JSON.stringify(settingsData.guardrails) : settingsData.guardrails,
            escalation_triggers: typeof settingsData.escalation_triggers === 'object' ? JSON.stringify(settingsData.escalation_triggers) : settingsData.escalation_triggers,
            formatting_rules: typeof settingsData.formatting_rules === 'object' ? JSON.stringify(settingsData.formatting_rules) : settingsData.formatting_rules,
            updated_at: new Date()
        };

        if (existing) {
            await DB('ai_assistant_settings').where({ id: existing.id }).update(dataToSave);
        } else {
            await DB('ai_assistant_settings').insert(dataToSave);
        }

        return this.getSettings();
    }
}

export default AiAssistantService;
