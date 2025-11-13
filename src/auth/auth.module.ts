// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module'; // Importe o UsersModule
import { LocalStrategy } from './strategies/local.strategy'; 
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module'; // Importe o PrismaModule

@Module({
  imports: [
    PrismaModule, // Garanta que o PrismaService esteja disponível
    UsersModule,  // Para acessar o UsersService
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'seuSegredoSuperSecreto', // Use variável de ambiente!
      signOptions: { expiresIn: '1d' }, // Token expira em 1 dia
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}