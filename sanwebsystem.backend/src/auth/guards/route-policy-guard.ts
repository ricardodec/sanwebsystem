import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoutePolicyEnum } from '../enum/route.policy.unum';
import { ROUTE_POLICY_KEY } from '../../common/app.constant';

@Injectable()
export class RoutePolicyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const routePolicyRequired = this.reflector.get<RoutePolicyEnum | undefined>(
      ROUTE_POLICY_KEY,
      context.getHandler(),
    );

    console.log(routePolicyRequired);

    return true;
  }
}
