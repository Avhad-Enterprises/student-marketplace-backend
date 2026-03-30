export interface ServiceCountrySettings {
    id?: number;
    // Service Availability Rules
    enable_service_activation_by_country: boolean;
    default_active_services: string | string[]; // Stored as JSON string, used as array
    auto_enable_new_services: boolean;
    allow_service_customization_by_country: boolean;
    service_visibility_mode: string;

    // Country Default Rules
    default_destination_country: string;
    default_currency_per_country: string;
    default_visa_type_per_country: string;
    default_intake_mapping: string;
    risk_category_per_country: string;
    auto_escalation_high_risk: boolean;

    // University Defaults
    default_university_status: string;
    ranking_source_type: string;
    default_comparison_weight: number;
    auto_approve_listed_universities: boolean;
    allow_manual_ranking_override: boolean;

    // Operational Defaults
    default_app_deadline_buffer: number;
    auto_assign_counselor_on_activation: boolean;
    require_doc_before_service_activation: boolean;
    allow_multi_service_parallel: boolean;

    created_at?: Date;
    updated_at?: Date;
}
