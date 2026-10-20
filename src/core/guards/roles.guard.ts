import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true; // لو مفيش أدوار محددة، اسمح بالمرور طالما معاه Token
    }
    const { user } = context.switchToHttp().getRequest<{
      user?: { role: string };
    }>();
    const hasRole = user?.role ? requiredRoles.includes(user.role) : false;
    if (!hasRole) {
      throw new ForbiddenException(
        'ليس لديك الصلاحية الكافية للقيام بهذا الإجراء',
      );
    }
    return true;
  }
}
