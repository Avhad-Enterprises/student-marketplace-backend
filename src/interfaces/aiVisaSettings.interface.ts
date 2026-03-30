export interface AiVisaSettings {
  id?: number;
  enable_ai_assistant: boolean;
  ai_mode: string;
  risk_sensitivity: string;
  confidence_threshold: number;
  escalation_threshold: number;
  prompt_template: string;
  allow_country_injection: boolean;
  allow_document_injection: boolean;
  allow_financial_injection: boolean;
  enable_response_explanations: boolean;
  block_unverified_data: boolean;
  require_manual_review: boolean;
  log_decisions: boolean;
  enable_audit_trail: boolean;
  require_human_approval: boolean;
  updated_at?: Date;
}
