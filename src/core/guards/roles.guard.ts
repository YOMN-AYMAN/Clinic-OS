import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest<{
      user?: { role: UserRole };
    }>();
    const hasRole = user?.role ? requiredRoles.includes(user.role) : false;
    if (!hasRole) {
      throw new ForbiddenException(
        `ليس لديك الصلاحية الكافية للقيام بهذا الإجراء ${user?.role ?? ''}`,
      );
    }
    return true;
  }
}
