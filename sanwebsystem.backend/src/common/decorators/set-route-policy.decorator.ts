import { RoutePolicyEnum } from '@/src/auth/enum/route.policy.unum';
import { SetMetadata } from '@nestjs/common';
import { ROUTE_POLICY_KEY } from '../app.constant';

export const SetRoutePolicy = (policy: RoutePolicyEnum) => {
    return SetMetadata(ROUTE_POLICY_KEY, policy);
};
