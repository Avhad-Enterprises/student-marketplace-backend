import { IsString, IsOptional, IsBoolean, IsNumber, IsIn } from 'class-validator';

export class CreateForexDto {
    @IsString()
    @IsOptional()
    public forexId?: string;

    @IsString()
    public providerName!: string;

    @IsString()
    public serviceType!: string;

    @IsNumber()
    @IsOptional()
    public currencyPairs?: number;

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
    public avgFee?: string;

    @IsString()
    @IsOptional()
    public transferSpeed?: string;

    @IsNumber()
    @IsOptional()
    public popularity?: number;
}

export class UpdateForexDto {
    @IsString()
    @IsOptional()
    public providerName?: string;

    @IsString()
    @IsOptional()
    public serviceType?: string;

    @IsNumber()
    @IsOptional()
    public currencyPairs?: number;

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
    public avgFee?: string;

    @IsString()
    @IsOptional()
    public transferSpeed?: string;

    @IsNumber()
    @IsOptional()
    public popularity?: number;
}
