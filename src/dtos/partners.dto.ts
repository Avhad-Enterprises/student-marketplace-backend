import { IsString, IsOptional, IsNumber, IsIn } from 'class-validator';

export class CreatePartnerDto {
    @IsNumber()
    public student_db_id!: number;

    @IsString()
    public name!: string;

    @IsString()
    @IsOptional()
    public partner_type?: string;

    @IsString()
    @IsOptional()
    @IsIn(['active', 'pending', 'archived'])
    public status?: string;
}

export class UpdatePartnerDto {
    @IsString()
    @IsOptional()
    public name?: string;

    @IsString()
    @IsOptional()
    public partner_type?: string;

    @IsString()
    @IsOptional()
    @IsIn(['active', 'pending', 'archived'])
    public status?: string;
}
