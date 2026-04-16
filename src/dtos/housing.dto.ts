import { IsString, IsOptional, IsBoolean, IsNumber, IsIn } from 'class-validator';

export class CreateHousingDto {
    @IsString()
    @IsOptional()
    public referenceId?: string;

    @IsString()
    public providerName!: string;

    @IsString()
    public housingType!: string;

    @IsString()
    public location!: string;

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
    public avgRent?: string;

    @IsBoolean()
    @IsOptional()
    public verified?: boolean;

    @IsNumber()
    @IsOptional()
    public popularity?: number;
}

export class UpdateHousingDto {
    @IsString()
    @IsOptional()
    public providerName?: string;

    @IsString()
    @IsOptional()
    public housingType?: string;

    @IsString()
    @IsOptional()
    public location?: string;

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
    public avgRent?: string;

    @IsBoolean()
    @IsOptional()
    public verified?: boolean;

    @IsNumber()
    @IsOptional()
    public popularity?: number;
}
