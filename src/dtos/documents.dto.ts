import { IsString, IsNumber, IsOptional, IsIn, IsUrl } from 'class-validator';

export class CreateDocumentDto {
    @IsNumber()
    public studentDbId!: number;

    @IsString()
    public name!: string;

    @IsString()
    public category!: string;

    @IsString()
    @IsIn(['pending', 'verified', 'rejected', 'expired'])
    public status!: string;

    @IsString()
    public file_type!: string;

    @IsNumber()
    public file_size!: number;

    @IsString()
    public uploaded_by!: string;

    @IsString()
    @IsUrl()
    public file_url!: string;
}

export class UpdateDocumentDto {
    @IsString()
    @IsOptional()
    public name?: string;

    @IsString()
    @IsOptional()
    public category?: string;

    @IsString()
    @IsOptional()
    @IsIn(['pending', 'verified', 'rejected', 'expired'])
    public status?: string;

    @IsString()
    @IsOptional()
    public file_type?: string;

    @IsNumber()
    @IsOptional()
    public file_size?: number;

    @IsString()
    @IsOptional()
    public uploaded_by?: string;

    @IsString()
    @IsOptional()
    @IsUrl()
    public file_url?: string;
}
