import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsString,
    IsStrongPassword,
    MaxLength,
    MinLength,
} from 'class-validator';

export class LoginDto {
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

    @IsString()
    @IsStrongPassword(
        {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        },
        {
            message:
                'O campo senha deve conter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos',
        },
    )
    @IsNotEmpty({ message: 'O campo senha é obrigatório' })
    @MaxLength(20, {
        message: 'O campo senha deve conter no máximo 20 caracteres',
    })
    @ApiProperty({
        description: 'Senha válida',
        minLength: 8,
        maxLength: 20,
    })
    readonly senha?: string;
}
