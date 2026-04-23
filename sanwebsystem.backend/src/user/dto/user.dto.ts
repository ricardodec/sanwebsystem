import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserDto {
  @IsOptional()
  @IsUUID('4', { message: 'O campo id deve ser um UUID válido' })
  @ApiProperty({
    description: 'Identificador do usuário',
  })
  readonly id?: string;

  @IsString()
  @IsNotEmpty({ message: 'O campo login é obrigatório' })
  @MinLength(5, { message: 'O campo login deve conter no mínimo 5 caracteres' })
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
        'O campo password deve conter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos',
    },
  )
  @IsNotEmpty({ message: 'O campo password é obrigatório' })
  @MaxLength(20, {
    message: 'O campo password deve conter no máximo 20 caracteres',
  })
  @ApiProperty({
    description: 'Password válida',
    minLength: 8,
    maxLength: 20,
  })
  readonly password?: string;

  @IsString()
  @IsNotEmpty({ message: 'O campo name é obrigatório' })
  @MinLength(5, { message: 'O campo name deve conter no mínimo 5 caracteres' })
  @MaxLength(50, {
    message: 'O campo name deve conter no máximo 50 caracteres',
  })
  @ApiProperty({
    description: 'Nome do usuário',
    minLength: 5,
    maxLength: 50,
  })
  readonly name?: string;

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

  @IsBoolean()
  @ApiProperty({
    description: 'Usuário ativo ou inativo',
  })
  readonly active?: boolean;
}
