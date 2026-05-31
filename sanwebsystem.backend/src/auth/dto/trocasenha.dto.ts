import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsString,
    IsStrongPassword,
    MaxLength,
} from 'class-validator';
import { LoginDto } from './login.dto';

export class TrocaSenhaDto extends LoginDto {
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
                'Campo de senha deve conter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos',
        },
    )
    @IsNotEmpty({ message: 'O campo de nova senha é obrigatório' })
    @MaxLength(20, {
        message: 'Campo de senha deve conter no máximo 20 caracteres',
    })
    @ApiProperty({
        description: 'Nova senha do usuário',
        minLength: 8,
        maxLength: 20,
    })
    readonly novaSenha?: string;

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
                'Campo de senha deve conter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos',
        },
    )
    @IsNotEmpty({ message: 'O campo de nova senha é obrigatório' })
    @MaxLength(20, {
        message: 'Campo de senha deve conter no máximo 20 caracteres',
    })
    @ApiProperty({
        description: 'Nova senha do usuário',
        minLength: 8,
        maxLength: 20,
    })
    readonly confirmaSenha?: string;
}
