import { IsString, IsOptional, IsArray, IsIn, IsDateString, MinLength, MaxLength } from 'class-validator';

export class CreateBlogDto {
    @IsString()
    @IsOptional()
    public blog_id?: string;

    @IsString()
    @MinLength(5)
    @MaxLength(100)
    public title!: string;

    @IsString()
    public author!: string;

    @IsString()
    public category!: string;

    @IsString()
    public content!: string;

    @IsOptional()
    public tags?: string | string[];

    @IsString()
    @IsOptional()
    @IsIn(['draft', 'published', 'scheduled', 'archived'])
    public status?: string;

    @IsString()
    @IsOptional()
    @IsIn(['public', 'private', 'restricted', 'internal'])
    public visibility?: string;

    @IsDateString()
    @IsOptional()
    public publish_date?: string;

    @IsString()
    @IsOptional()
    public meta_title?: string;

    @IsString()
    @IsOptional()
    public meta_description?: string;
}

export class UpdateBlogDto {
    @IsString()
    @IsOptional()
    @MinLength(5)
    @MaxLength(100)
    public title?: string;

    @IsString()
    @IsOptional()
    public author?: string;

    @IsString()
    @IsOptional()
    public category?: string;

    @IsString()
    @IsOptional()
    public content?: string;

    @IsOptional()
    public tags?: string | string[];

    @IsString()
    @IsOptional()
    @IsIn(['draft', 'published', 'scheduled', 'archived'])
    public status?: string;

    @IsString()
    @IsOptional()
    @IsIn(['public', 'private', 'restricted', 'internal'])
    public visibility?: string;

    @IsDateString()
    @IsOptional()
    public publish_date?: string;

    @IsString()
    @IsOptional()
    public meta_title?: string;

    @IsString()
    @IsOptional()
    public meta_description?: string;
}
