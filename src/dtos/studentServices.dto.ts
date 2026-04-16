import { IsString, IsNumber, IsOptional, IsIn, IsDateString } from 'class-validator';

export class CreateStudentServiceDto {
    @IsNumber()
    public student_db_id!: number;

    @IsString()
    public service_type!: string;

    @IsString()
    public service_name!: string;

    @IsString()
    public provider!: string;

    @IsString()
    @IsIn(['pending', 'active', 'completed', 'cancelled', 'on-hold'])
    public status!: string;

    @IsDateString()
    @IsOptional()
    public start_date?: string;

    @IsDateString()
    @IsOptional()
    public end_date?: string;

    @IsNumber()
    @IsOptional()
    public amount?: number;

    @IsString()
    @IsOptional()
    public currency?: string;

    @IsString()
    @IsOptional()
    @IsIn(['low', 'medium', 'high', 'urgent'])
    public priority?: string;

    @IsString()
    @IsOptional()
    public notes?: string;

    @IsString()
    @IsOptional()
    public assigned_to?: string;
}

export class UpdateStudentServiceDto {
    @IsString()
    @IsOptional()
    public service_type?: string;

    @IsString()
    @IsOptional()
    public service_name?: string;

    @IsString()
    @IsOptional()
    public provider?: string;

    @IsString()
    @IsOptional()
    @IsIn(['pending', 'active', 'completed', 'cancelled', 'on-hold'])
    public status?: string;

    @IsDateString()
    @IsOptional()
    public start_date?: string;

    @IsDateString()
    @IsOptional()
    public end_date?: string;

    @IsNumber()
    @IsOptional()
    public amount?: number;

    @IsString()
    @IsOptional()
    public currency?: string;

    @IsString()
    @IsOptional()
    @IsIn(['low', 'medium', 'high', 'urgent'])
    public priority?: string;

    @IsString()
    @IsOptional()
    public notes?: string;

    @IsString()
    @IsOptional()
    public assigned_to?: string;
}
