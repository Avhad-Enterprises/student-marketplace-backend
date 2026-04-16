import { IsString, IsOptional, IsBoolean, IsNumber, IsIn } from 'class-validator';

export class CreateBuildCreditDto {
    @IsString()
    @IsOptional()
    public reference_id?: string;

    @IsString()
    public provider_name!: string;

    @IsString()
    public program_name!: string;

    @IsString()
    public program_type!: string;

    @IsString()
    @IsOptional()
    @IsIn(['active', 'inactive', 'archived'])
    public status?: string;

    @IsBoolean()
    @IsOptional()
    public student_visible?: boolean;

    @IsString()
    @IsOptional()
    public credit_limit?: string;

    @IsString()
    @IsOptional()
    public reporting_to?: string;

    @IsString()
    @IsOptional()
    public eligibility_criteria?: string;

    @IsNumber()
    @IsOptional()
    public popularity?: number;
}

export class UpdateBuildCreditDto {
    @IsString()
    @IsOptional()
    public provider_name?: string;

    @IsString()
    @IsOptional()
    public program_name?: string;

    @IsString()
    @IsOptional()
    public program_type?: string;

    @IsString()
    @IsOptional()
    @IsIn(['active', 'inactive', 'archived'])
    public status?: string;

    @IsBoolean()
    @IsOptional()
    public student_visible?: boolean;

    @IsString()
    @IsOptional()
    public credit_limit?: string;

    @IsString()
    @IsOptional()
    public reporting_to?: string;

    @IsString()
    @IsOptional()
    public eligibility_criteria?: string;

    @IsNumber()
    @IsOptional()
    public popularity?: number;
}
