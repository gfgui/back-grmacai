import { ApiProperty } from '@nestjs/swagger'; // 1. Importe o ApiProperty
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'johndoe@email.com' }) // 2. Adicione aqui
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 }) // 3. E aqui
  @IsString()
  @MinLength(6)
  password: string;
}