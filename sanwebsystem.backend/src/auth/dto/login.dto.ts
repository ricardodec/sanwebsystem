import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'O campo login é obrigatório' })
  readonly login?: string;

  @IsString()
  @IsNotEmpty({ message: 'O campo password é obrigatório' })
  readonly password?: string;
}
