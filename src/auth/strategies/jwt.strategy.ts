// src/auth/strategies/jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Pega o token do header
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'seuSegredoSuperSecreto', // Mesma chave do JwtModule
    });
  }

  // O payload é o objeto que você colocou dentro do token ao criá-lo (no auth.service)
  async validate(payload: any) {
    // Você pode adicionar mais validações aqui, como verificar se o user.id existe no DB
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}