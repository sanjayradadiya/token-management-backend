import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { UserService } from '../../user/user.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const action = this.reflector.get('action', context.getHandler());
    const subject = this.reflector.get('subject', context.getHandler());

    if (action && subject) {
      const gqlContext = GqlExecutionContext.create(context);
      const user = gqlContext.getContext().req.user;

      if (!user) {
        return false;
      }
      const userData = await this.userService.findUserById(user.id);
    }
    return true;
  }
}
