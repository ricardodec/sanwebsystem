'use client';

import { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { classNames } from 'primereact/utils';
import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import { AppTopbarRef } from '@types';
import { LayoutContext } from './context/layoutcontext';
import TopMenu from './TopMenu';

const AppTopbarSimple = forwardRef<AppTopbarRef>((props, ref) => {
    
    const { layoutState } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
    }));

    const itens: MenuItem[] = TopMenu();

    return (
        <div className="layout-topbar">
            <Link href="/" className="flex flex-column layout-topbar-logo-simple">
                <Image src={`/layout/images/logo_san.png`} height={35} alt="logo" />
                <span className='text-xs'>WEB SYSTEM</span>
            </Link>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <Menubar model={itens} className='p-top-menu' />
            </div>
        </div>
    );
});

AppTopbarSimple.displayName = 'AppTopbarSimple';

export default AppTopbarSimple;