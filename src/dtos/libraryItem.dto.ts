import { IsString, IsOptional, IsArray, IsIn, IsNumber } from 'class-validator';

export class CreateLibraryItemDto {
    @IsString()
    public item_id!: string;

    @IsString()
    public title!: string;

    @IsOptional()
    @IsString()
    public exam?: string;

    @IsOptional()
    @IsString()
    public difficulty?: string;

    @IsOptional()
    @IsString()
    public topic?: string;

    @IsOptional()
    @IsString()
    public type?: string;

    @IsOptional()
    @IsString()
    public transcript?: string;

    @IsOptional()
    public sections_included?: any;

    @IsOptional()
    @IsString()
    public duration?: string;

    @IsOptional()
    @IsString()
    public status?: string;

    @IsOptional()
    @IsNumber()
    public usage_30d?: number;
}

export class UpdateLibraryItemDto {
    @IsOptional()
    @IsString()
    public title?: string;

    @IsOptional()
    @IsString()
    public exam?: string;

    @IsOptional()
    @IsString()
    public difficulty?: string;

    @IsOptional()
    @IsString()
    public topic?: string;

    @IsOptional()
    @IsString()
    public type?: string;

    @IsOptional()
    @IsString()
    public transcript?: string;

    @IsOptional()
    public sections_included?: any;

    @IsOptional()
    @IsString()
    public duration?: string;

    @IsOptional()
    @IsString()
    public status?: string;

    @IsOptional()
    @IsNumber()
    public usage_30d?: number;
}
