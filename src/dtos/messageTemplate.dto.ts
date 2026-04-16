import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateMessageTemplateDto {
    @IsString()
    public template_id!: string;

    @IsString()
    public name!: string;

    @IsString()
    public subject!: string;

    @IsString()
    public content!: string;

    @IsString()
    public category!: string;

    @IsBoolean()
    @IsOptional()
    public is_active?: boolean;
}

export class UpdateMessageTemplateDto {
    @IsString()
    @IsOptional()
    public name?: string;

    @IsString()
    @IsOptional()
    public subject?: string;

    @IsString()
    @IsOptional()
    public content?: string;

    @IsString()
    @IsOptional()
    public category?: string;

    @IsBoolean()
    @IsOptional()
    public is_active?: boolean;
}
