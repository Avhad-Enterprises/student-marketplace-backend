import { IsBoolean, IsOptional, IsArray, IsObject } from 'class-validator';

export class UpdateComparisonRulesDto {
    @IsBoolean()
    @IsOptional()
    public enable_country_scoring?: boolean;

    @IsArray()
    @IsOptional()
    public country_scoring_parameters?: string[];

    @IsObject()
    @IsOptional()
    public country_weight_distribution?: Record<string, number>;

    @IsBoolean()
    @IsOptional()
    public allow_manual_score_override?: boolean;

    @IsBoolean()
    @IsOptional()
    public enable_university_ranking_engine?: boolean;

    @IsObject()
    @IsOptional()
    public university_weight_configuration?: Record<string, number>;

    @IsBoolean()
    @IsOptional()
    public min_eligibility_threshold_required?: boolean;

    @IsBoolean()
    @IsOptional()
    public enable_smart_matching?: boolean;

    @IsBoolean()
    @IsOptional()
    public auto_suggest_top_5_countries?: boolean;

    @IsBoolean()
    @IsOptional()
    public auto_suggest_top_10_universities?: boolean;

    @IsBoolean()
    @IsOptional()
    public exclude_high_risk_options?: boolean;

    @IsBoolean()
    @IsOptional()
    public allow_counselor_override_matching?: boolean;
}
