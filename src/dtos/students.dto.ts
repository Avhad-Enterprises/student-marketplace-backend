import { IsEmail, IsString, IsOptional, IsBoolean, IsDateString, IsArray, IsNumber } from 'class-validator';

export class CreateStudentDto {
    @IsString()
    public firstName!: string;

    @IsString()
    public lastName!: string;

    @IsEmail()
    public email!: string;

    @IsString()
    @IsOptional()
    public dateOfBirth?: string;

    @IsString()
    public countryCode!: string;

    @IsString()
    public phoneNumber!: string;

    @IsString()
    public nationality!: string;

    @IsString()
    public currentCountry!: string;

    @IsString()
    public primaryDestination!: string;

    @IsString()
    public intendedIntake!: string;

    @IsString()
    public currentStage!: string;

    @IsString()
    @IsOptional()
    public assignedCounselor?: string;

    @IsString()
    @IsOptional()
    public riskLevel?: string;

    @IsString()
    @IsOptional()
    public leadSource?: string;

    @IsString()
    @IsOptional()
    public campaign?: string;

    @IsArray()
    @IsOptional()
    public countryPreferences?: string[];

    @IsString()
    @IsOptional()
    public notes?: string;

    @IsBoolean()
    @IsOptional()
    public accountStatus?: boolean;
}

export class UpdateStudentDto {
    @IsString()
    @IsOptional()
    public firstName?: string;

    @IsString()
    @IsOptional()
    public lastName?: string;

    @IsEmail()
    @IsOptional()
    public email?: string;

    @IsString()
    @IsOptional()
    public dateOfBirth?: string;

    @IsString()
    @IsOptional()
    public countryCode?: string;

    @IsString()
    @IsOptional()
    public phoneNumber?: string;

    @IsString()
    @IsOptional()
    public nationality?: string;

    @IsString()
    @IsOptional()
    public currentCountry?: string;

    @IsString()
    @IsOptional()
    public primaryDestination?: string;

    @IsString()
    @IsOptional()
    public intendedIntake?: string;

    @IsString()
    @IsOptional()
    public currentStage?: string;

    @IsString()
    @IsOptional()
    public riskLevel?: string;

    @IsBoolean()
    @IsOptional()
    public accountStatus?: boolean;
}
