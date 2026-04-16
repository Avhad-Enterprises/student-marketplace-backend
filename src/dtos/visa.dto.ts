import { IsString, IsOptional, IsBoolean, IsNumber, IsIn } from 'class-validator';

export class CreateVisaDto {
    @IsString()
    @IsOptional()
    public visaId?: string;

    @IsString()
    public visaType!: string;

    @IsString()
    @IsOptional()
    public category?: string;

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
    @IsIn(['Low', 'Medium', 'High'])
    public processingDifficulty?: string;

    @IsBoolean()
    @IsOptional()
    public workRights?: boolean;

    @IsBoolean()
    @IsOptional()
    public highApproval?: boolean;

    @IsNumber()
    @IsOptional()
    public popularity?: number;
}

export class UpdateVisaDto {
    @IsString()
    @IsOptional()
    public visaType?: string;

    @IsString()
    @IsOptional()
    public category?: string;

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
    @IsIn(['Low', 'Medium', 'High'])
    public processingDifficulty?: string;

    @IsBoolean()
    @IsOptional()
    public workRights?: boolean;

    @IsBoolean()
    @IsOptional()
    public highApproval?: boolean;

    @IsNumber()
    @IsOptional()
    public popularity?: number;
}
