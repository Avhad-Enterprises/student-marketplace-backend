import { IsString, IsOptional, IsEmail, IsObject } from 'class-validator';

export class CreateEnquiryDto {
    @IsString()
    public enquiry_id!: string;

    @IsString()
    public student_name!: string;

    @IsEmail()
    public student_email!: string;

    @IsString()
    public service_interest!: string;

    @IsString()
    public message!: string;

    @IsString()
    @IsOptional()
    public status?: string;

    @IsObject()
    @IsOptional()
    public additional_info?: any;
}

export class UpdateEnquiryDto {
    @IsString()
    @IsOptional()
    public status?: string;

    @IsString()
    @IsOptional()
    public counsellor_notes?: string;

    @IsObject()
    @IsOptional()
    public additional_info?: any;
}
