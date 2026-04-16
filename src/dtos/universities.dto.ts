import { IsString, IsOptional, IsNumber, IsIn } from 'class-validator';

export class CreateUniversityDto {
    @IsString()
    public name!: string;

    @IsString()
    @IsOptional()
    public univ_id?: string;

    @IsString()
    public city!: string;

    @IsString()
    @IsOptional()
    public country_id?: string;

    @IsString()
    @IsOptional()
    public country?: string;

    @IsString()
    @IsOptional()
    public tuition?: string;

    @IsString()
    @IsOptional()
    public acceptanceRate?: string;

    @IsString()
    @IsOptional()
    public type?: string;

    @IsString()
    @IsOptional()
    @IsIn(['open', 'closed', 'on-hold', 'not-available'])
    public applicationStatus?: string;

    @IsNumber()
    @IsOptional()
    public ranking?: number;

    @IsString()
    @IsOptional()
    public intakes?: string;

    @IsString()
    @IsOptional()
    @IsIn(['active', 'inactive', 'archived'])
    public status?: string;
}

export class UpdateUniversityDto {
    @IsString()
    @IsOptional()
    public name?: string;

    @IsString()
    @IsOptional()
    public city?: string;

    @IsString()
    @IsOptional()
    public country_id?: string;

    @IsString()
    @IsOptional()
    public country?: string;

    @IsString()
    @IsOptional()
    public tuition?: string;

    @IsString()
    @IsOptional()
    public acceptanceRate?: string;

    @IsString()
    @IsOptional()
    public type?: string;

    @IsString()
    @IsOptional()
    @IsIn(['open', 'closed', 'on-hold', 'not-available'])
    public applicationStatus?: string;

    @IsNumber()
    @IsOptional()
    public ranking?: number;

    @IsString()
    @IsOptional()
    public intakes?: string;

    @IsString()
    @IsOptional()
    @IsIn(['active', 'inactive', 'archived'])
    public status?: string;
}
