import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { NO_ACCOUNT_GUARD_KEY } from 'src/decorators/no-account-guard.decorator';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AccountGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const noAccountGuard = this.reflector.getAllAndOverride<boolean>(
      NO_ACCOUNT_GUARD_KEY,
      [context.getHandler(), context.getClass()],
    );

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic || noAccountGuard) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (!user.emailVerifiedAt) {
      throw new UnauthorizedException(`Account not verified`);
    }

    return true;
  }
}
