// src/auth/strategies/local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto'; 

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // Configura o passport-local para usar 'email' como usernameField
    super({ usernameField: 'email' });
  }

  // Este método é chamado automaticamente pelo Passport ao usar o AuthGuard('local')
  async validate(email: string, pass: string): Promise<any> {
    const user = await this.authService.validateUser(email, pass);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return user; // O usuário validado é anexado ao req.user
  }
}