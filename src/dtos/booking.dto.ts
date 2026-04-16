import { IsString, IsOptional, IsDateString, IsNumber } from 'class-validator';

export class CreateBookingDto {
    @IsString()
    public booking_id!: string;

    @IsNumber()
    public student_db_id!: number;

    @IsString()
    public service_type!: string;

    @IsString()
    public service_name!: string;

    @IsDateString()
    public date_time!: string;

    @IsString()
    @IsOptional()
    public status?: string;

    @IsString()
    @IsOptional()
    public notes?: string;
}

export class UpdateBookingDto {
    @IsString()
    @IsOptional()
    public service_type?: string;

    @IsString()
    @IsOptional()
    public service_name?: string;

    @IsDateString()
    @IsOptional()
    public date_time?: string;

    @IsString()
    @IsOptional()
    public status?: string;

    @IsString()
    @IsOptional()
    public notes?: string;
}
