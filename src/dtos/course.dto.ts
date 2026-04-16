import { IsString, IsOptional, IsBoolean, IsNumber, IsIn } from 'class-validator';

export class CreateCourseDto {
    @IsString()
    @IsOptional()
    public reference_id?: string;

    @IsString()
    public course_name!: string;

    @IsString()
    public provider!: string;

    @IsString()
    public category!: string;

    @IsString()
    public duration!: string;

    @IsNumber()
    @IsOptional()
    public countries_covered?: number;

    @IsString()
    @IsOptional()
    @IsIn(['active', 'inactive', 'archived'])
    public status?: string;

    @IsBoolean()
    @IsOptional()
    public student_visible?: boolean;

    @IsString()
    @IsOptional()
    public avg_cost?: string;

    @IsNumber()
    @IsOptional()
    public popularity?: number;

    @IsNumber()
    @IsOptional()
    public learners_count?: number;

    @IsNumber()
    @IsOptional()
    public rating?: number;
}

export class UpdateCourseDto {
    @IsString()
    @IsOptional()
    public course_name?: string;

    @IsString()
    @IsOptional()
    public provider?: string;

    @IsString()
    @IsOptional()
    public category?: string;

    @IsString()
    @IsOptional()
    public duration?: string;

    @IsNumber()
    @IsOptional()
    public countries_covered?: number;

    @IsString()
    @IsOptional()
    @IsIn(['active', 'inactive', 'archived'])
    public status?: string;

    @IsBoolean()
    @IsOptional()
    public student_visible?: boolean;

    @IsString()
    @IsOptional()
    public avg_cost?: string;

    @IsNumber()
    @IsOptional()
    public popularity?: number;

    @IsNumber()
    @IsOptional()
    public learners_count?: number;

    @IsNumber()
    @IsOptional()
    public rating?: number;
}
