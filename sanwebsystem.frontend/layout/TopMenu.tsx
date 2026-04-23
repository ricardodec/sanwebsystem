/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MenuItem } from 'primereact/menuitem';
import Loading from '@ui/loading';
import { logout } from './Logout';
import { AuthContext, AuthType } from '@context/auth';

const TopMenu = () => {
    const { auth, dispatch } = useContext(AuthContext);

    const signedUser = auth.signedUser as Auth.ISignedUser | null;
    const parceiro = auth.parceiro as Control.IParceiro | null;

    const router = useRouter();
    const [itens, setItens] = useState<MenuItem[]>([]);

    useEffect(() => {
        setItens([
            {
                label: parceiro === null ? 'Parceiro' : parceiro.nome,
                icon: 'pi pi-sync',
                command: () => {
                    Loading.show();
                    router.push('/parceiro/acesso');
                },
            },
            {
                label: 'Configurações',
                icon: 'pi pi-cog',
                items: [
                    {
                        label: 'Perfil do Usuário',
                        icon: 'pi pi-user-edit',
                        command: () => {
                            Loading.show();
                            dispatch({
                                type: AuthType.PARCEIRO,
                                payload: null,
                            });
                            router.push('/user');
                        },
                    },
                    {
                        label: 'Grupos de Acesso',
                        icon: 'pi pi-tags',
                        visible: signedUser?.ehControlador === true,
                        command: () => {
                            Loading.show();
                            dispatch({
                                type: AuthType.PARCEIRO,
                                payload: null,
                            });
                            router.push('/grupoacesso');
                        },
                    },
                    {
                        label: 'Usuários',
                        icon: 'pi pi-users',
                        visible: signedUser?.ehControlador === true,
                        command: () => {
                            Loading.show();
                            dispatch({
                                type: AuthType.PARCEIRO,
                                payload: null,
                            });
                            router.push('/usuario');
                        },
                    },
                    {
                        label: 'Parceiro(s)',
                        icon: 'pi pi-building',
                        visible: signedUser?.ehControlador === true,
                        command: () => {
                            Loading.show();
                            dispatch({
                                type: AuthType.PARCEIRO,
                                payload: null,
                            });
                            router.push('/parceiro');
                        },
                    },
                    {
                        label: 'Feriados',
                        icon: 'pi pi-calendar',
                        visible: signedUser?.ehControlador === true,
                        command: () => {
                            Loading.show();
                            dispatch({
                                type: AuthType.PARCEIRO,
                                payload: null,
                            });
                            router.push('/feriado');
                        },
                    },
                    {
                        label: 'Parâmetros Gerais',
                        icon: 'pi pi-wrench',
                        visible: signedUser?.ehControlador === true,
                        command: () => {
                            Loading.show();
                            dispatch({
                                type: AuthType.PARCEIRO,
                                payload: null,
                            });
                            router.push('/parametro');
                        },
                    },
                ],
            },
            {
                label: 'Sair',
                icon: 'pi pi-sign-out',
                command: () => {
                    logout(dispatch);
                },
            },
        ]);
    }, [signedUser, parceiro]);

    return itens;
};

export default TopMenu;
