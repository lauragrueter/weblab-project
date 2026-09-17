import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWorkoutDto {

    @ApiProperty({
        example: 'Running'
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: '2026-09-03'
    })
    @IsDateString()
    @IsNotEmpty()
    date: string;

    @ApiProperty({
        example: 60
    })
    @IsInt()
    @Min(1)
    duration: number;

    @ApiPropertyOptional({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
    @IsUUID()
    @IsOptional()
    categoryId?: string;
}