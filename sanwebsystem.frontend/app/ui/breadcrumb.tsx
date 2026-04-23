import React from 'react';
import { BreadCrumb } from 'primereact/breadcrumb';
import { MenuItem } from 'primereact/menuitem';

type BreadCrumbUIProps = {
    menu: MenuItem[];
};

const BreadcrumbUI = ({ menu }: Readonly<BreadCrumbUIProps>) => {
    const home: MenuItem = { icon: 'pi pi-home', expanded: true };

    if (menu.length > 0)
        home.command = menu[0].command;

    return <BreadCrumb model={menu} home={home} />;
}

export default BreadcrumbUI;