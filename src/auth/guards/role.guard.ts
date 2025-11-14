import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'generated/prisma/enums';
import { ROLES_KEY } from '../decorators/role.decorator'; 

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Pega as 'roles' definidas no decorador @Roles() da rota
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true; // Se nenhuma role é exigida, permite o acesso
    }

    // Pega o usuário que foi injetado pelo AuthGuard('jwt')
    const { user } = context.switchToHttp().getRequest();

    // Verifica se a 'role' do usuário existe na lista de 'roles' exigidas
    return requiredRoles.some((role) => user.role === role);
  }
}