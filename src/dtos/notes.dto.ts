import { IsString, IsNumber, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class CreateNoteDto {
    @IsNumber()
    public student_db_id!: number;

    @IsString()
    public note_type!: string;

    @IsString()
    public title!: string;

    @IsString()
    public content!: string;

    @IsString()
    public created_by!: string;

    @IsBoolean()
    @IsOptional()
    public is_pinned?: boolean;

    @IsArray()
    @IsOptional()
    public tags?: string[];
}

export class UpdateNoteDto {
    @IsString()
    @IsOptional()
    public note_type?: string;

    @IsString()
    @IsOptional()
    public title?: string;

    @IsString()
    @IsOptional()
    public content?: string;

    @IsBoolean()
    @IsOptional()
    public is_pinned?: boolean;

    @IsArray()
    @IsOptional()
    public tags?: string[];
}
