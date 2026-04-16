import { IsString, IsOptional, IsBoolean, IsNumber, IsIn, IsObject } from 'class-validator';

export class UpdateAiAssistantSettingsDto {
    @IsString()
    @IsOptional()
    public assistant_name?: string;

    @IsString()
    @IsOptional()
    public tagline?: string;

    @IsString()
    @IsOptional()
    public default_language?: string;

    @IsString()
    @IsOptional()
    public model_provider?: string;

    @IsString()
    @IsOptional()
    public model_version?: string;

    @IsNumber()
    @IsOptional()
    public temperature?: number;

    @IsString()
    @IsOptional()
    public response_length?: string;

    @IsString()
    @IsOptional()
    public memory_window?: string;

    @IsBoolean()
    @IsOptional()
    public streaming?: boolean;

    @IsNumber()
    @IsOptional()
    public timeout?: number;

    @IsNumber()
    @IsOptional()
    public retry_attempts?: number;

    @IsString()
    @IsOptional()
    public tone?: string;

    @IsString()
    @IsOptional()
    public answer_style?: string;

    @IsString()
    @IsOptional()
    public communication_style?: string;

    @IsNumber()
    @IsOptional()
    public confidence_threshold?: number;

    @IsString()
    @IsOptional()
    public confidence_visibility?: string;

    @IsString()
    @IsOptional()
    public escalation_action?: string;

    @IsString()
    @IsOptional()
    public welcome_message?: string;

    @IsObject()
    @IsOptional()
    public guardrails?: any;

    @IsObject()
    @IsOptional()
    public escalation_triggers?: any;

    @IsObject()
    @IsOptional()
    public formatting_rules?: any;

    @IsString()
    @IsOptional()
    @IsIn(['online', 'offline', 'maintenance'])
    public status?: string;

    @IsBoolean()
    @IsOptional()
    public strict_mode?: boolean;

    @IsString()
    @IsOptional()
    public profile_icon?: string;

    @IsString()
    @IsOptional()
    public escalation_message?: string;

    @IsString()
    @IsOptional()
    public escalation_button_text?: string;

    @IsBoolean()
    @IsOptional()
    public enable_ai_visa_assistant?: boolean;

    @IsString()
    @IsOptional()
    public ai_mode?: string;

    @IsString()
    @IsOptional()
    public risk_sensitivity_level?: string;

    @IsNumber()
    @IsOptional()
    public escalation_trigger_threshold?: number;

    @IsString()
    @IsOptional()
    public default_prompt_template?: string;

    @IsBoolean()
    @IsOptional()
    public allow_dynamic_country_prompt_injection?: boolean;

    @IsBoolean()
    @IsOptional()
    public allow_document_context_injection?: boolean;

    @IsBoolean()
    @IsOptional()
    public allow_financial_data_injection?: boolean;

    @IsBoolean()
    @IsOptional()
    public enable_response_explanation_mode?: boolean;

    @IsBoolean()
    @IsOptional()
    public block_unverified_student_data?: boolean;

    @IsBoolean()
    @IsOptional()
    public require_manual_review_for_high_risk_cases?: boolean;

    @IsBoolean()
    @IsOptional()
    public log_all_ai_decisions?: boolean;

    @IsBoolean()
    @IsOptional()
    public enable_ai_audit_trail?: boolean;

    @IsBoolean()
    @IsOptional()
    public enable_human_approval_required?: boolean;
}
