import { Injectable, ConflictException } from '@nestjs/common';
// Importe o DTO da API REST (Swagger)
import { UpdateUserDto } from './dto/update-user.dto'; // <-- 1. CORREÇÃO
// Você pode remover os imports do GraphQL se não for usá-los
import { CreateUserInput } from './dto/create-user.input';
// import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt'; // Importe o bcrypt

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Cria um novo usuário (com hashing de senha)
   */
  async create(createUserInput: CreateUserInput) {
    const { email, password, ...rest } = createUserInput;

    // 1. Verifica se o usuário já existe
    const existingUser = await this.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException('Um usuário com este email já existe');
    }

    // 2. Faz o hash da senha
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Salva no banco
    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        ...rest,
      },
    });
  }

  /**
   * Busca um usuário pelo email (usado pelo AuthService)
   */
  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Retorna todos os usuários
   */
  findAll() {
    // Cuidado: Isso retorna o hash da senha.
    // Em produção, use 'select' ou 'omit' no seu resolver/tipo GraphQL
    // para não expor o campo 'password'.
    return this.prisma.user.findMany();
  }

  /**
   * Retorna um usuário pelo ID
   */
  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Atualiza um usuário
   */
  async update(id: string, updateUserInput: UpdateUserDto) { // <-- 2. CORREÇÃO
    const { password, ...data } = updateUserInput; // 3. A lógica interna continua igual e correta
    const updateData: any = data;

    // 1. Se a senha estiver sendo atualizada, faz o hash da nova senha
    if (password) {
      const salt = await bcrypt.genSalt();
      updateData.password = await bcrypt.hash(password, salt);
    }

    // 2. Atualiza no banco usando o 'id' do primeiro parâmetro
    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Remove um usuário
   */
  remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}