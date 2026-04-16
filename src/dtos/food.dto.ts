import { IsString, IsOptional, IsBoolean, IsNumber, IsIn } from 'class-validator';

export class CreateFoodDto {
    @IsString()
    @IsOptional()
    public reference_id?: string;

    @IsString()
    public platform!: string;

    @IsString()
    public service_type!: string;

    @IsString()
    @IsOptional()
    public offer_details?: string;

    @IsNumber()
    @IsOptional()
    public countries_covered?: number;

    @IsString()
    @IsOptional()
    @IsIn(['active', 'inactive', 'archived'])
    public status?: string;

    @IsBoolean()
    @IsOptional()
    public student_visible?: boolean;

    @IsString()
    @IsOptional()
    public avg_cost?: string;

    @IsBoolean()
    @IsOptional()
    public verified?: boolean;

    @IsNumber()
    @IsOptional()
    public popularity?: number;
}

export class UpdateFoodDto {
    @IsString()
    @IsOptional()
    public platform?: string;

    @IsString()
    @IsOptional()
    public service_type?: string;

    @IsString()
    @IsOptional()
    public offer_details?: string;

    @IsNumber()
    @IsOptional()
    public countries_covered?: number;

    @IsString()
    @IsOptional()
    @IsIn(['active', 'inactive', 'archived'])
    public status?: string;

    @IsBoolean()
    @IsOptional()
    public student_visible?: boolean;

    @IsString()
    @IsOptional()
    public avg_cost?: string;

    @IsBoolean()
    @IsOptional()
    public verified?: boolean;

    @IsNumber()
    @IsOptional()
    public popularity?: number;
}
