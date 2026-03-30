export interface ComparisonRules {
    id?: number;
    // Country Scoring Logic
    enable_country_scoring: boolean;
    country_scoring_parameters: string[]; // JSON array on DB
    country_weight_distribution: Record<string, number>; // JSON object on DB
    allow_manual_score_override: boolean;

    // University Ranking Logic
    enable_university_ranking_engine: boolean;
    university_weight_configuration: Record<string, number>; // JSON object on DB
    min_eligibility_threshold_required: boolean;

    // Matching Engine Rules
    enable_smart_matching: boolean;
    auto_suggest_top_5_countries: boolean;
    auto_suggest_top_10_universities: boolean;
    exclude_high_risk_options: boolean;
    allow_counselor_override_matching: boolean;

    created_at?: Date;
    updated_at?: Date;
}
