// src/users/dto/create-user.input.ts

import { InputType, Field } from '@nestjs/graphql'; // Importe o 'String'
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsEmail()
  @Field(() => String)
  email: string;

  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  @Field(() => String)
  password: string;

  @IsNotEmpty({ message: 'O primeiro nome não pode estar vazio' })
  @Field(() => String)
  firstName: string;

  @IsNotEmpty({ message: 'O último nome não pode estar vazio' })
  @Field(() => String)
  lastName: string;
}