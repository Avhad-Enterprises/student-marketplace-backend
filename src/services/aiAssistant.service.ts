import { AiAssistantSettings, AiAssistantSettingsVersion } from '@/interfaces/aiAssistant.interface';
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
                strict_mode: true,
                profile_icon: '',
                escalation_message: 'I apologize, but I am not confident in my answer. Would you like to speak with a professional counsellor?',
                escalation_button_text: 'Connect with Counsellor',
                enable_ai_visa_assistant: true,
                ai_mode: 'Balanced',
                risk_sensitivity_level: 'Medium',
                escalation_trigger_threshold: 60,
                default_prompt_template: 'Analyze the student profile and provide a comprehensive visa assessment. Consider academic background, financial situation, English proficiency, work experience, and destination country requirements. Provide recommendations for countries with the highest visa success probability.',
                allow_dynamic_country_prompt_injection: true,
                allow_document_context_injection: true,
                allow_financial_data_injection: false,
                enable_response_explanation_mode: true,
                block_unverified_student_data: true,
                require_manual_review_for_high_risk_cases: true,
                log_all_ai_decisions: true,
                enable_ai_audit_trail: true,
                enable_human_approval_required: false
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

        // Save version snapshot
        try {
            const versionData = {
                settings_data: JSON.stringify(settingsData),
                version_label: `v${new Date().getTime()}`,
                created_at: new Date(),
                created_by: 'Admin' // This could be dynamic if we have user context
            };
            await DB('ai_assistant_settings_versions').insert(versionData);
        } catch (error) {
            logger.error('Error saving settings version:', error);
        }

        return this.getSettings();
    }

    public async getVersions(): Promise<AiAssistantSettingsVersion[]> {
        return DB('ai_assistant_settings_versions').orderBy('created_at', 'desc').limit(50);
    }

    public async rollbackToVersion(versionId: number): Promise<AiAssistantSettings> {
        const versionSnapshot = await DB('ai_assistant_settings_versions').where({ id: versionId }).first();
        if (!versionSnapshot) {
            throw new Error('Version not found');
        }

        const settingsData = typeof versionSnapshot.settings_data === 'string'
            ? JSON.parse(versionSnapshot.settings_data)
            : versionSnapshot.settings_data;

        return this.updateSettings(settingsData);
    }
}

export default AiAssistantService;
