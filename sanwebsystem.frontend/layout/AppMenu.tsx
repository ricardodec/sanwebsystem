import { useContext, useEffect, useState } from 'react';
import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem, Control } from '../types';
import Loading from '@ui/loading';
import { logout } from './Logout';
import fetchService from '@actions/fetch';
import { AuthContext } from '@context/auth';

const AppMenu = () => {
    const { auth, dispatch } = useContext(AuthContext);
    const [model, setModel] = useState<AppMenuItem[]>([]);

    useEffect(() => {
        const parceiro: Control.IParceiro | null = auth.parceiro;

        const getComponente = (
            componente: Control.IComponente,
        ): AppMenuItem => {
            const menuItem: AppMenuItem = {
                label: componente.nome,
            };

            if (componente.to) menuItem.to = componente.to;
            if (componente.url) menuItem.url = componente.url;

            if (componente.to || componente.url || componente.target) {
                menuItem.command = componente.target
                    ? eval(componente.target)
                    : () => Loading.show();
                menuItem.icon =
                    componente.to && componente.icon
                        ? componente.icon
                        : `pi pi-fw pi-eye-slash`;
            }

            if (
                componente.componentes !== null &&
                componente.componentes.length > 0
            ) {
                menuItem.items = [];

                for (const inferior of componente.componentes as Control.IComponente[]) {
                    menuItem.items.push(getComponente(inferior));
                }
            }

            return menuItem;
        };

        fetchService({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/controle/parceiro/menu`,
            method: `POST`,
            token: auth.token as string,
            body: parceiro?.id.toString(),
        })
            .then((data: Control.IMenu | null) => {
                const menu: AppMenuItem = [
                    {
                        label: 'Home',
                        items: [
                            {
                                label: 'Painel de Gestão',
                                icon: 'pi pi-fw pi-home',
                                to: '/dashboard',
                                command: () => Loading.show(),
                            },
                        ],
                    },
                ];

                if (data?.modulos) {
                    for (const modulo of data.modulos as Control.IModulo[]) {
                        const menuItem: AppMenuItem = {
                            label: modulo.nome,
                            icon: 'pi pi-fw pi-briefcase',
                        };

                        if (
                            modulo.componentes !== null &&
                            modulo.componentes.length > 0
                        ) {
                            menuItem.items = [];

                            for (const componente of modulo.componentes as Control.IComponente[]) {
                                menuItem.items.push(getComponente(componente));
                            }
                        }

                        menu.push(menuItem);
                    }
                }

                menu.push({
                    label: 'Sair',
                    items: [
                        {
                            label: 'Desconectar',
                            icon: 'pi pi-fw pi-unlock',
                            command: async () => await logout(dispatch),
                        },
                    ],
                });

                setModel(menu);
            })
            .finally(() => {
                Loading.hide();
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    let key: number = 0;

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    if (item?.seperator) key++;
                    return item?.seperator ? (
                        <li
                            className="menu-separator"
                            key={`menu-sep-${key}`}
                        ></li>
                    ) : (
                        <AppMenuitem
                            item={item}
                            root={true}
                            index={i}
                            key={item.label}
                        />
                    );
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
