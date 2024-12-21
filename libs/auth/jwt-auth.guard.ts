import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard, IAuthModuleOptions } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getAuthenticateOptions(context: ExecutionContext): IAuthModuleOptions<any> {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
