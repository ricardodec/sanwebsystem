'use client';

import { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { classNames } from 'primereact/utils';
import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import { AppTopbarRef } from '../types';
import { LayoutContext } from './context/layoutcontext';
import TopMenu from './TopMenu';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    
    const { layoutState, onMenuToggle } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
    }));

    const itens: MenuItem[] = TopMenu();

    return (
        <div className="layout-topbar">
            <Link href="/" className="flex flex-column align-items-center layout-topbar-logo">
                <Image src={`/layout/images/logo_san.png`} height={35} alt="logo" />
                <span className='text-xs'>WEB SYSTEM</span>
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <Menubar model={itens} className='p-top-menu' />
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
