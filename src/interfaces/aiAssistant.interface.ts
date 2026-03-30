export interface AiAssistantSettings {
    id?: number;
    assistant_name: string;
    tagline: string;
    default_language: string;
    model_provider: string;
    model_version: string;
    temperature: number;
    response_length: string;
    memory_window: string;
    streaming: boolean;
    timeout: number;
    retry_attempts: number;
    tone: string;
    answer_style: string;
    communication_style: string;
    confidence_threshold: number;
    confidence_visibility: string;
    escalation_action: string;
    welcome_message: string;
    guardrails: any;
    escalation_triggers: any;
    formatting_rules: any;
    status: string;
    strict_mode: boolean;
    profile_icon?: string;
    escalation_message: string;
    escalation_button_text: string;
    enable_ai_visa_assistant: boolean;
    ai_mode: string;
    risk_sensitivity_level: string;
    escalation_trigger_threshold: number;
    default_prompt_template: string;
    allow_dynamic_country_prompt_injection: boolean;
    allow_document_context_injection: boolean;
    allow_financial_data_injection: boolean;
    enable_response_explanation_mode: boolean;
    block_unverified_student_data: boolean;
    require_manual_review_for_high_risk_cases: boolean;
    log_all_ai_decisions: boolean;
    enable_ai_audit_trail: boolean;
    enable_human_approval_required: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export interface AiAssistantSettingsVersion {
    id?: number;
    settings_data: any;
    version_label?: string;
    created_at?: Date;
    created_by?: string;
}
