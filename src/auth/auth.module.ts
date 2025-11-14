// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './strategies/local.strategy'; 
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module'; 

@Module({
  imports: [
    PrismaModule, 
    UsersModule,  
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'seuSegredoSuperSecreto',
      signOptions: { expiresIn: '1d' }, // Token expira em 1 dia
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}