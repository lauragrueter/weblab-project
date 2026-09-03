import { IsDateString, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
}