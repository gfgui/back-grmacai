// src/users/dto/update-user.input.ts

import { CreateUserInput } from './create-user.input';
import { InputType, Field, PartialType } from '@nestjs/graphql'; // Importe 'String'

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => String) // <-- CORRIGIDO: Era Int, agora é String
  id: string; // <-- O tipo TypeScript já estava correto
}