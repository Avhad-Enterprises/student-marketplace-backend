import { IsString, IsEmail, IsOptional, IsNumber, IsUrl } from 'class-validator';

export class CreateExpertDto {
    @IsString()
    public full_name: string;

    @IsOptional()
    @IsEmail()
    public email?: string;

    @IsString()
    @IsOptional()
    public phone?: string;

    @IsString()
    @IsOptional()
    public specialization?: string;

    @IsNumber()
    @IsOptional()
    public experience_years?: number;

    @IsNumber()
    @IsOptional()
    public rating?: number;

    @IsString()
    @IsOptional()
    public status?: string;

    @IsString()
    @IsOptional()
    public avatar_url?: string;

    @IsString()
    @IsOptional()
    public bio?: string;

    constructor() {
        this.full_name = '';
    }
}

export class UpdateExpertDto {
    @IsString()
    @IsOptional()
    public full_name?: string;

    @IsEmail()
    @IsOptional()
    public email?: string;

    @IsString()
    @IsOptional()
    public phone?: string;

    @IsString()
    @IsOptional()
    public specialization?: string;

    @IsNumber()
    @IsOptional()
    public experience_years?: number;

    @IsNumber()
    @IsOptional()
    public rating?: number;

    @IsString()
    @IsOptional()
    public status?: string;

    @IsString()
    @IsOptional()
    public avatar_url?: string;

    @IsString()
    @IsOptional()
    public bio?: string;
}
