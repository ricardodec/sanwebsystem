import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AddHeaderInterceptor } from '../common/interceptors/add-header.interceptor';
import { RefreshTokenDto } from './config/refresh-token.dto';
import { AuthGuard } from './guards/auth-guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(AddHeaderInterceptor)
export class AuthController {
  constructor(private readonly appService: AuthService) {}

  @ApiOperation({ summary: 'Autenticar no sistema e receber um token' })
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{
    token: string | undefined;
  }> {
    return await this.appService.login(loginDto);
  }

  @ApiOperation({ summary: 'Atualizar o token de acesso' })
  @Post('refresh')
  @UseGuards(AuthGuard)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<{
    token: string | undefined;
  }> {
    return await this.appService.refreshToken(refreshTokenDto);
  }
}
