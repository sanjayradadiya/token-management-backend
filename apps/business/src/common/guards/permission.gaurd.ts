import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { BusinessService } from '../../Business/business.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private businessService: BusinessService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const action = this.reflector.get('action', context.getHandler());
    const subject = this.reflector.get('subject', context.getHandler());

    if (action && subject) {
      const gqlContext = GqlExecutionContext.create(context);
      const business = gqlContext.getContext().req.business;

      if (!business) {
        return false;
      }
      const businessData = await this.businessService.findBusinessById(
        business.id,
      );
      console.log('Business', businessData);
    }
    return true;
  }
}
