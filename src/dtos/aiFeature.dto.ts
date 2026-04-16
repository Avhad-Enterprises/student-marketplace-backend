import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateAiFeatureDto {
    @IsString()
    public name!: string;

    @IsString()
    public description!: string;

    @IsString()
    @IsOptional()
    public icon?: string;

    @IsString()
    @IsOptional()
    public path?: string;

    @IsBoolean()
    @IsOptional()
    public is_enabled?: boolean;

    @IsNumber()
    @IsOptional()
    public order?: number;

    @IsString()
    @IsOptional()
    public category?: string;

    @IsString()
    @IsOptional()
    public feature_id?: string;
}

export class UpdateAiFeatureDto {
    @IsString()
    @IsOptional()
    public name?: string;

    @IsString()
    @IsOptional()
    public description?: string;

    @IsString()
    @IsOptional()
    public icon?: string;

    @IsString()
    @IsOptional()
    public path?: string;

    @IsBoolean()
    @IsOptional()
    public is_enabled?: boolean;

    @IsNumber()
    @IsOptional()
    public order?: number;

    @IsString()
    @IsOptional()
    public category?: string;
}
