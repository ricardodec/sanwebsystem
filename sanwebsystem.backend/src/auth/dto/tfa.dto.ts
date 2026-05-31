import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class TfaDto {
    @IsString()
    @IsNotEmpty({ message: 'O campo login é obrigatório' })
    @MinLength(5, {
        message: 'O campo login deve conter no mínimo 5 caracteres',
    })
    @MaxLength(50, {
        message: 'O campo login deve conter no máximo 50 caracteres',
    })
    @ApiProperty({
        description: 'Login do usuário',
        minLength: 5,
        maxLength: 50,
    })
    readonly login?: string;

    @IsNotEmpty({ message: 'O campo e-mail é obrigatório' })
    @IsEmail(undefined, {
        message: 'O campo email deve ser um endereço de email válido',
    })
    @MaxLength(255, {
        message: 'O campo email deve conter no máximo 255 caracteres',
    })
    @ApiProperty({
        description: 'E-mail válido',
    })
    readonly email?: string;
}
