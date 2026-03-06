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
    created_at?: Date;
    updated_at?: Date;
}
