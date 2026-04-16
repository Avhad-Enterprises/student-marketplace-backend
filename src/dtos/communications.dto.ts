import { IsString, IsNumber, IsOptional, IsIn } from 'class-validator';

export class CreateCommunicationDto {
    @IsNumber()
    public student_db_id!: number;

    @IsString()
    public type!: string;

    @IsString()
    @IsIn(['sent', 'received', 'pending', 'failed'])
    public status!: string;

    @IsString()
    public content!: string;

    @IsString()
    public sender!: string;
}

export class UpdateCommunicationDto {
    @IsString()
    @IsOptional()
    public type?: string;

    @IsString()
    @IsOptional()
    @IsIn(['sent', 'received', 'pending', 'failed'])
    public status?: string;

    @IsString()
    @IsOptional()
    public content?: string;

    @IsString()
    @IsOptional()
    public sender?: string;
}
