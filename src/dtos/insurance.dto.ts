import { IsString, IsOptional, IsBoolean, IsNumber, IsIn } from 'class-validator';

export class CreateInsuranceDto {
    @IsString()
    @IsOptional()
    public insurance_id?: string;

    @IsString()
    public provider_name!: string;

    @IsString()
    public policy_name!: string;

    @IsString()
    public coverage_type!: string;

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
    public duration?: string;

    @IsBoolean()
    @IsOptional()
    public visa_compliant?: boolean;

    @IsBoolean()
    @IsOptional()
    public mandatory?: boolean;

    @IsNumber()
    @IsOptional()
    public popularity?: number;
}

export class UpdateInsuranceDto {
    @IsString()
    @IsOptional()
    public provider_name?: string;

    @IsString()
    @IsOptional()
    public policy_name?: string;

    @IsString()
    @IsOptional()
    public coverage_type?: string;

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
    public duration?: string;

    @IsBoolean()
    @IsOptional()
    public visa_compliant?: boolean;

    @IsBoolean()
    @IsOptional()
    public mandatory?: boolean;

    @IsNumber()
    @IsOptional()
    public popularity?: number;
}
