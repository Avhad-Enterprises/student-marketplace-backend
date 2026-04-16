import { IsString, IsOptional, IsBoolean, IsNumber, IsIn, IsArray } from 'class-validator';

export class CreateCountryDto {
    @IsString()
    public name!: string;

    @IsString()
    public code!: string;

    @IsString()
    public region!: string;

    @IsString()
    @IsIn(['Low', 'Medium', 'High'])
    public visa_difficulty!: string;

    @IsString()
    @IsIn(['Low', 'Medium', 'High'])
    public cost_of_living!: string;

    @IsBoolean()
    @IsOptional()
    public work_rights?: boolean;

    @IsBoolean()
    @IsOptional()
    public pr_availability?: boolean;

    @IsString()
    @IsOptional()
    @IsIn(['active', 'inactive', 'archived'])
    public status?: string;

    @IsNumber()
    @IsOptional()
    public popularity?: number;

    // Service Flags
    @IsBoolean()
    @IsOptional()
    public service_visa?: boolean;

    @IsBoolean()
    @IsOptional()
    public service_insurance?: boolean;

    @IsBoolean()
    @IsOptional()
    public service_housing?: boolean;

    @IsBoolean()
    @IsOptional()
    public service_loans?: boolean;

    @IsBoolean()
    @IsOptional()
    public service_forex?: boolean;

    @IsBoolean()
    @IsOptional()
    public service_courses?: boolean;

    @IsBoolean()
    @IsOptional()
    public service_food?: boolean;
}

export class UpdateCountryDto {
    @IsString()
    @IsOptional()
    public name?: string;

    @IsString()
    @IsOptional()
    public code?: string;

    @IsString()
    @IsOptional()
    public region?: string;

    @IsString()
    @IsOptional()
    @IsIn(['Low', 'Medium', 'High'])
    public visa_difficulty?: string;

    @IsString()
    @IsOptional()
    @IsIn(['Low', 'Medium', 'High'])
    public cost_of_living?: string;

    @IsBoolean()
    @IsOptional()
    public work_rights?: boolean;

    @IsBoolean()
    @IsOptional()
    public pr_availability?: boolean;

    @IsString()
    @IsOptional()
    @IsIn(['active', 'inactive', 'archived'])
    public status?: string;

    @IsNumber()
    @IsOptional()
    public popularity?: number;
}
