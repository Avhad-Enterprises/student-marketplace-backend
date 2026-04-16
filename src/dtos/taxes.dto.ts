import { IsString, IsOptional, IsBoolean, IsNumber, IsIn } from 'class-validator';

export class CreateTaxDto {
    @IsString()
    @IsOptional()
    public taxId?: string;

    @IsString()
    public serviceName!: string;

    @IsString()
    public provider!: string;

    @IsNumber()
    @IsOptional()
    public countriesCovered?: number;

    @IsString()
    @IsOptional()
    @IsIn(['active', 'inactive', 'archived'])
    public status?: string;

    @IsBoolean()
    @IsOptional()
    public studentVisible?: boolean;

    @IsString()
    @IsOptional()
    public cost?: string;

    @IsString()
    @IsOptional()
    public processingTime?: string;

    @IsNumber()
    @IsOptional()
    public popularity?: number;
}

export class UpdateTaxDto {
    @IsString()
    @IsOptional()
    public serviceName?: string;

    @IsString()
    @IsOptional()
    public provider?: string;

    @IsNumber()
    @IsOptional()
    public countriesCovered?: number;

    @IsString()
    @IsOptional()
    @IsIn(['active', 'inactive', 'archived'])
    public status?: string;

    @IsBoolean()
    @IsOptional()
    public studentVisible?: boolean;

    @IsString()
    @IsOptional()
    public cost?: string;

    @IsString()
    @IsOptional()
    public processingTime?: string;

    @IsNumber()
    @IsOptional()
    public popularity?: number;
}
