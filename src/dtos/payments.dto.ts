import { IsString, IsNumber, IsOptional, IsIn, IsDateString, Min } from 'class-validator';

export class CreatePaymentDto {
    @IsNumber()
    @Min(0)
    public amount!: number;

    @IsNumber()
    public student_db_id!: number;

    @IsString()
    @IsOptional()
    public payment_id?: string;

    @IsString()
    @IsOptional()
    public invoice_number?: string;

    @IsString()
    @IsOptional()
    public description?: string;

    @IsString()
    @IsOptional()
    public currency?: string;

    @IsString()
    @IsOptional()
    public service_type?: string;

    @IsString()
    @IsOptional()
    @IsIn(['pending', 'paid', 'overdue', 'cancelled', 'refunded'])
    public status?: string;

    @IsString()
    @IsOptional()
    public payment_method?: string;

    @IsDateString()
    @IsOptional()
    public due_date?: string;

    @IsDateString()
    @IsOptional()
    public paid_date?: string;

    @IsString()
    @IsOptional()
    public created_by?: string;

    @IsString()
    @IsOptional()
    public notes?: string;
}

export class UpdatePaymentDto {
    @IsNumber()
    @IsOptional()
    @Min(0)
    public amount?: number;

    @IsString()
    @IsOptional()
    public description?: string;

    @IsString()
    @IsOptional()
    public currency?: string;

    @IsString()
    @IsOptional()
    public service_type?: string;

    @IsString()
    @IsOptional()
    @IsIn(['pending', 'paid', 'overdue', 'cancelled', 'refunded'])
    public status?: string;

    @IsString()
    @IsOptional()
    public payment_method?: string;

    @IsDateString()
    @IsOptional()
    public due_date?: string;

    @IsDateString()
    @IsOptional()
    public paid_date?: string;

    @IsString()
    @IsOptional()
    public notes?: string;
}
