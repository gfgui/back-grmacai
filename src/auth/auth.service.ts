// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../prisma/prisma.service'; // Use seu PrismaService
import { Role } from 'generated/prisma/enums'; 

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService, // Injete o PrismaService
  ) {}

  /**
   * Chamado pela LocalStrategy para validar o usuário.
   */
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user; // Remove a senha do objeto de retorno
      return result;
    }
    return null;
  }

  /**
   * Chamado pelo AuthController após o usuário ser validado pela LocalStrategy.
   */
  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      }
    };
  }

  /**
   * Lógica de registro de novo usuário.
   */
  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName } = registerDto;

    // 1. Verificar se o email já existe
    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException('O email já está em uso');
    }

    // 2. Fazer o hash da senha
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Criar o usuário no banco
    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: Role.CUSTOMER, // Padrão definido no schema, mas é bom ser explícito
      },
    });

    // 4. Retornar o usuário criado (ou um token de login, se preferir)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = newUser;
    return result;
  }
}