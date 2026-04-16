import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateStatusTrackingDto {
    @IsNumber()
    public studentDbId!: number;

    @IsString()
    public stage!: string;

    @IsString()
    public subStatus!: string;

    @IsString()
    public notes!: string;

    @IsString()
    public changedBy!: string;
}
