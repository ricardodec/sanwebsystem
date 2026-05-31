import {
    Body,
    Controller,
    Post,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddHeaderInterceptor } from '../common/interceptors/add-header.interceptor';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './config/refresh-token.dto';
import { LoginDto } from './dto/login.dto';
import { ResponseLoginDto } from './dto/response-login.dto';
import { ResponseTfaDto } from './dto/response-tfa.dto';
import { ResponseTrocaSenhaDto } from './dto/response-trocasenha.dto';
import { ResponseValidateTfaDto } from './dto/response-validate-tfa.dto';
import { SignedUserDto } from './dto/signeduser.dto';
import { TfaDto } from './dto/tfa.dto';
import { TrocaSenhaDto } from './dto/trocasenha.dto';
import { AuthGuard } from './guards/auth-guard';

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(AddHeaderInterceptor)
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: 'Autenticar no sistema e receber um token' })
    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<ResponseLoginDto> {
        return await this.authService.login(loginDto);
    }

    @ApiOperation({ summary: 'Trocar a senha do usuário' })
    @Post('trocarsenha')
    async trocarSenha(
        @Body() trocaSenhaDto: TrocaSenhaDto,
    ): Promise<ResponseTrocaSenhaDto> {
        return await this.authService.trocarSenha(trocaSenhaDto);
    }

    @ApiOperation({ summary: 'Atualizar o token de acesso' })
    @Post('refresh')
    @UseGuards(AuthGuard)
    async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<{
        token: string | undefined;
    }> {
        return await this.authService.refreshToken(refreshTokenDto);
    }

    @ApiOperation({ summary: 'Gerar chave TFA' })
    @Post('tfa/generatecode')
    async generateTfaCode(@Body() tfaDto: TfaDto): Promise<ResponseTfaDto> {
        return await this.authService.generateTfaCode(tfaDto);
    }

    @ApiOperation({ summary: 'Recompor chave TFA' })
    @Post('tfa/resetcode')
    async resetTfaCode(@Body() login: string): Promise<SignedUserDto> {
        return await this.authService.resetTfaCode(login);
    }

    @ApiOperation({ summary: 'Validar chave TFA' })
    @Post('tfa/validatecode')
    async validateTfaCode(
        @Body() validateCode: { login: string; tfaCode: string },
    ): Promise<ResponseValidateTfaDto> {
        const { signedUser, token, msgError } =
            await this.authService.validateTfaCode(
                validateCode.login,
                validateCode.tfaCode,
            );

        return {
            signedUser,
            token: token ?? null,
            msgError,
        };
    }
}
