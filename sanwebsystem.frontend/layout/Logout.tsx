'use client';

import { AuthAction, AuthType } from '@context/auth';
import { logoutService } from '@actions/authenticate';

export const logout = async (
    dispatch: React.ActionDispatch<[action: AuthAction]>,
) => {
    dispatch({ type: AuthType.PARAMETRO, payload: null });
    dispatch({ type: AuthType.TOKEN, payload: null });
    dispatch({ type: AuthType.SIGNEDUSER, payload: null });
    dispatch({ type: AuthType.PARCEIRO, payload: null });

    await logoutService();
};
