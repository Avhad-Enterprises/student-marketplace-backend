import { IsString, IsOptional, IsNumber, IsIn, IsBoolean } from 'class-validator';

export class CreateSOPDto {
    @IsString()
    public student_name!: string;

    @IsString()
    public country!: string;

    @IsString()
    public university!: string;

    @IsString()
    @IsOptional()
    public review_status?: string;

    @IsString()
    @IsOptional()
    public ai_confidence_score?: string;

    @IsString()
    @IsOptional()
    @IsIn(['active', 'inactive', 'archived'])
    public status?: string;
}

export class UpdateSOPDto {
    @IsString()
    @IsOptional()
    public student_name?: string;

    @IsString()
    @IsOptional()
    public country?: string;

    @IsString()
    @IsOptional()
    public university?: string;

    @IsString()
    @IsOptional()
    public review_status?: string;

    @IsString()
    @IsOptional()
    public ai_confidence_score?: string;

    @IsString()
    @IsOptional()
    @IsIn(['active', 'inactive', 'archived'])
    public status?: string;
}

export class UpdateSopAssistantSettingsDto {
    @IsBoolean()
    @IsOptional()
    public enable_ai_sanitization?: boolean;

    @IsNumber()
    @IsOptional()
    public max_word_count?: number;

    @IsString()
    @IsOptional()
    public preferred_language?: string;

    @IsBoolean()
    @IsOptional()
    public allow_external_reviews?: boolean;

    @IsString()
    @IsOptional()
    public model_version?: string;
}
