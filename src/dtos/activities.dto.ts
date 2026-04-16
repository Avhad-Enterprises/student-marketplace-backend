import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateActivityDto {
    @IsNumber()
    public student_db_id!: number;

    @IsString()
    public title!: string;

    @IsString()
    public content!: string;

    @IsString()
    public type!: string;
}

export class UpdateActivityDto {
    @IsString()
    @IsOptional()
    public title?: string;

    @IsString()
    @IsOptional()
    public content?: string;

    @IsString()
    @IsOptional()
    public type?: string;
}
