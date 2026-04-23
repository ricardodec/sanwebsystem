'use server';

import { z } from 'zod';
import { AuthAction, AuthType } from '@context/auth';
import Loading from '@ui/loading';
import fetchService from './fetch';

export interface IAuthLogin {
    signedUser: Partial<Auth.ISignedUser>;
    token: string | null;
    msgErro: string | null;
    dispatch: React.ActionDispatch<[action: AuthAction]>;
}

export async function loginPostAction(
    prevState: IAuthLogin,
    formData: FormData,
): Promise<IAuthLogin> {
    Loading.show();

    const authLoginSchema = z.object({
        signedUser: z.object({
            login: z
                .string()
                .trim()
                .min(3, 'O campo login é obrigatório.')
                .max(15, 'O campo login deve conter no máximo 15 caracteres.'),
            senha: z.string().trim().min(1, 'O campo senha é obrigatório.'),
        }),
        token: z.string().nullable(),
        msgErro: z.string().nullable(),
        dispatch: z.function({
            input: [z.object<AuthAction>()],
            output: z.void(),
        }),
    });

    const form = authLoginSchema.safeParse(
        Object.fromEntries(formData.entries()) as unknown as IAuthLogin,
    );

    if (!form.success) {
        Loading.hide();
        return prevState;
    }

    const data = await fetchService({
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        method: `POST`,
        body: JSON.stringify(form.data.signedUser),
    }).then((data: IAuthLogin | null) => {
        return data;
    });

    if (data === null) {
        Loading.hide();
        return prevState;
    }

    if (data.msgErro != null && data.msgErro != '') {
        Loading.hide();
        return data;
    }

    form.data.dispatch({ type: AuthType.SIGNEDUSER, payload: data.signedUser });

    if (!data.signedUser?.trocarSenha && !data.signedUser?.tfa) {
        form.data.dispatch({ type: AuthType.TOKEN, payload: data.token });
    }

    return data;
}
