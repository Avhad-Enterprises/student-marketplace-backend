import { IsString, IsOptional, IsBoolean, IsNumber, IsIn } from 'class-validator';

export class CreateBankDto {
    @IsString()
    @IsOptional()
    public bankId?: string;

    @IsString()
    public bankName!: string;

    @IsString()
    public accountType!: string;

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
    public minBalance?: string;

    @IsBoolean()
    @IsOptional()
    public digitalOnboarding?: boolean;

    @IsBoolean()
    @IsOptional()
    public studentFriendly?: boolean;

    @IsNumber()
    @IsOptional()
    public popularity?: number;
}

export class UpdateBankDto {
    @IsString()
    @IsOptional()
    public bankName?: string;

    @IsString()
    @IsOptional()
    public accountType?: string;

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
    public minBalance?: string;

    @IsBoolean()
    @IsOptional()
    public digitalOnboarding?: boolean;

    @IsBoolean()
    @IsOptional()
    public studentFriendly?: boolean;

    @IsNumber()
    @IsOptional()
    public popularity?: number;
}
