import { IsString, IsOptional, IsBoolean, IsNumber, IsIn } from 'class-validator';

export class CreateLoanDto {
    @IsString()
    @IsOptional()
    public loan_id?: string;

    @IsString()
    public provider_name!: string;

    @IsString()
    public product_name!: string;

    @IsString()
    public loan_type!: string;

    @IsNumber()
    @IsOptional()
    public countries_supported?: number;

    @IsString()
    @IsOptional()
    @IsIn(['active', 'inactive', 'archived'])
    public status?: string;

    @IsBoolean()
    @IsOptional()
    public student_visible?: boolean;

    @IsString()
    @IsOptional()
    public interest_rate?: string;

    @IsString()
    @IsOptional()
    public processing_fee?: string;

    @IsString()
    @IsOptional()
    public loan_amount_range?: string;

    @IsNumber()
    @IsOptional()
    public popularity?: number;
}

export class UpdateLoanDto {
    @IsString()
    @IsOptional()
    public provider_name?: string;

    @IsString()
    @IsOptional()
    public product_name?: string;

    @IsString()
    @IsOptional()
    public loan_type?: string;

    @IsNumber()
    @IsOptional()
    public countries_supported?: number;

    @IsString()
    @IsOptional()
    @IsIn(['active', 'inactive', 'archived'])
    public status?: string;

    @IsBoolean()
    @IsOptional()
    public student_visible?: boolean;

    @IsString()
    @IsOptional()
    public interest_rate?: string;

    @IsString()
    @IsOptional()
    public processing_fee?: string;

    @IsString()
    @IsOptional()
    public loan_amount_range?: string;

    @IsNumber()
    @IsOptional()
    public popularity?: number;
}
