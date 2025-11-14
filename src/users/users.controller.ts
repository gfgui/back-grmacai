import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto'; 
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/role.decorator'; 
import { RolesGuard } from 'src/auth/guards/role.guard'; 

@ApiTags('Users') // Agrupa no Swagger
@ApiBearerAuth() // Todas as rotas aqui pedem o token
@UseGuards(AuthGuard('jwt')) // Protege todas as rotas do controller
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Rota para o usuário logado buscar seus próprios dados
   */
  @Get('me')
  getProfile(@Request() req: any) {
    // req.user foi injetado pelo AuthGuard('jwt')
    // A JwtStrategy colocou { userId: payload.sub, ... } no req.user
    return this.usersService.findOne(req.user.userId);
  }

  /**
   * Rota para o usuário logado ATUALIZAR seus próprios dados
   */
  @Patch('me')
  updateProfile(
    @Request() req: any,
    @Body() updateUserDto: UpdateUserDto, // Um DTO sem o campo 'id'
  ) {
    const userId = req.user.userId;
    // O service.update já lida com o hash da senha, se ela for enviada
    return this.usersService.update(userId, updateUserDto);
  }

  /**
   * Rota para o usuário logado DELETAR sua própria conta
   */
  @Delete('me')
  deleteProfile(@Request() req: any) {
    const userId = req.user.userId;
    return this.usersService.remove(userId);
  }

  /**
   * Exemplo de rota para admin deletar usuário
  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    // Note que aqui pegamos o 'id' do parâmetro da URL,
    // e não do token, pois é um admin deletando outro usuário.
    return this.usersService.remove(id);
  }
    */
}