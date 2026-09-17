import { IsNotEmpty, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {

    @ApiProperty({
        example: 'Endurance'
    })
    @IsString()
    @IsNotEmpty()
    name: string;
}