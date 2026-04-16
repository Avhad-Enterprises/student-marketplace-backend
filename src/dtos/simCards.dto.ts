import { IsString, IsOptional, IsBoolean, IsNumber, IsIn } from 'class-validator';

export class CreateSimCardDto {
    @IsString()
    @IsOptional()
    public sim_id?: string;

    @IsString()
    public provider_name!: string;

    @IsString()
    public service_name!: string;

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
    public network_type?: string;

    @IsString()
    @IsOptional()
    public data_allowance?: string;

    @IsString()
    @IsOptional()
    public validity?: string;

    @IsNumber()
    @IsOptional()
    public popularity?: number;
}

export class UpdateSimCardDto {
    @IsString()
    @IsOptional()
    public provider_name?: string;

    @IsString()
    @IsOptional()
    public service_name?: string;

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
    public network_type?: string;

    @IsString()
    @IsOptional()
    public data_allowance?: string;

    @IsString()
    @IsOptional()
    public validity?: string;

    @IsNumber()
    @IsOptional()
    public popularity?: number;
}
