// src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth') // Agrupa no Swagger
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Rota de Login
   * Usa o AuthGuard('local') para disparar a LocalStrategy
   */
  @ApiBody({ type: LoginDto })
  @UseGuards(AuthGuard('local')) // Ativa a LocalStrategy
  @Post('login')
  async login(@Request() req: any) {
    // req.user é populado pela LocalStrategy após a validação
    return this.authService.login(req.user);
  }

  /**
   * Rota de Registro
   */
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * Rota de Perfil (Exemplo de rota protegida)
   * Usa o AuthGuard('jwt') para disparar a JwtStrategy
   */
  @ApiBearerAuth() // Indica ao Swagger que precisa de token
  @UseGuards(AuthGuard('jwt')) // Ativa a JwtStrategy
  @Get('profile')
  getProfile(@Request() req: any) {
    // req.user é populado pela JwtStrategy com os dados do payload do token
    return req.user;
  }
}