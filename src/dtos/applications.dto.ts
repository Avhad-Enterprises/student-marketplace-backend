import { IsString, IsOptional, IsDateString, IsIn } from 'class-validator';

export class CreateApplicationDto {
    @IsString()
    public studentDbId!: string;

    @IsString()
    public universityName!: string;

    @IsString()
    public country!: string;

    @IsString()
    public intake!: string;

    @IsString()
    @IsOptional()
    @IsIn(['in-progress', 'submitted', 'decision-received', 'pending-docs', 'closed'])
    public status?: string;

    @IsString()
    @IsOptional()
    public counselor?: string;

    @IsDateString()
    @IsOptional()
    public submissionDate?: string;

    @IsDateString()
    @IsOptional()
    public decisionDate?: string;

    @IsString()
    @IsOptional()
    public notes?: string;
}

export class UpdateApplicationDto {
    @IsString()
    @IsOptional()
    public universityName?: string;

    @IsString()
    @IsOptional()
    public country?: string;

    @IsString()
    @IsOptional()
    public intake?: string;

    @IsString()
    @IsOptional()
    @IsIn(['in-progress', 'submitted', 'decision-received', 'pending-docs', 'closed'])
    public status?: string;

    @IsString()
    @IsOptional()
    public counselor?: string;

    @IsDateString()
    @IsOptional()
    public submissionDate?: string;

    @IsDateString()
    @IsOptional()
    public decisionDate?: string;

    @IsString()
    @IsOptional()
    public notes?: string;
}
