import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    public email!: string;

    @IsString()
    @MinLength(8)
    public password!: string;

    @IsString()
    public full_name!: string;

    @IsString()
    public user_type!: string;
}

export class UpdateUserDto {
    @IsEmail()
    @IsOptional()
    public email?: string;

    @IsString()
    @MinLength(8)
    @IsOptional()
    public password?: string;

    @IsString()
    @IsOptional()
    public full_name?: string;

    @IsString()
    @IsOptional()
    public first_name?: string;

    @IsString()
    @IsOptional()
    public last_name?: string;

    @IsString()
    @IsOptional()
    public user_type?: string;

    @IsString()
    @IsOptional()
    public account_status?: string;

    @IsOptional()
    public role_id?: number | string;
}

export class LoginUserDto {
    @IsEmail()
    public email!: string;

    @IsString()
    public password!: string;
}
