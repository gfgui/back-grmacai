import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersController } from './users.controller';
import { UsersResolver } from './users.resolver'; // 1. Importe o Resolver

@Module({
  imports: [PrismaModule],
  providers: [
    UsersService,
    UsersResolver, // 2. Adicione o Resolver aqui
  ],
  exports: [UsersService],
  controllers: [UsersController], // 3. Corrija a sintaxe aqui (linha separada)
})
export class UsersModule {}