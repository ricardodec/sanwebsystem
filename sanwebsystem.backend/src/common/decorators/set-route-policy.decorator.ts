import { SetMetadata } from '@nestjs/common';
import { ROUTE_POLICY_KEY } from '../app.constant';
import { RoutePolicyEnum } from '@/src/auth/enum/route.policy.unum';

export const SetRoutePolicy = (policy: RoutePolicyEnum) => {
  return SetMetadata(ROUTE_POLICY_KEY, policy);
};
