'use client';

import { useContext, useEffect, useRef } from 'react';
import { useEventListener, useUnmountEffect } from 'primereact/hooks';
import { ScrollTop } from 'primereact/scrolltop';
import { classNames } from 'primereact/utils';
import AppFooter from '@layout/AppFooter';
import AppTopbarSimple from '@layout/AppTopbarSimple';
import { LayoutContext } from '@layout/context/layoutcontext';
import { ChildContainerProps, LayoutState, AppTopbarRef } from '@types';
import { usePathname, useSearchParams } from 'next/navigation';

const TopBarLayout = ({ children }: ChildContainerProps) => {
    
    const { layoutConfig, layoutState, setLayoutState } = useContext(LayoutContext);
    const topbarRef = useRef<AppTopbarRef>(null);

    const pathname = usePathname();
    const searchParams = useSearchParams();

    const unblockBodyScroll = (): void => {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(' blocked-scroll', '');
        }
    };

    const [bindProfileMenuOutsideClickListener, unbindProfileMenuOutsideClickListener] = useEventListener({
        type: 'click',
        listener: (event) => {
            const isOutsideClicked = !(
                topbarRef.current?.topbarmenu?.isSameNode(event.target as Node) ||
                topbarRef.current?.topbarmenu?.contains(event.target as Node)
            );

            if (isOutsideClicked) {
                hideProfileMenu();
            }
        }
    });

    const hideProfileMenu = () => {
        setLayoutState((prevLayoutState: LayoutState) => ({
            ...prevLayoutState,
            profileSidebarVisible: false
        }));
        unbindProfileMenuOutsideClickListener();
    };
    
    useEffect(() => {
        hideProfileMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, searchParams]);

    const blockBodyScroll = (): void => {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    };

    useEffect(() => {
        if (layoutState.staticMenuMobileActive) {
            blockBodyScroll();
        } else {
            unblockBodyScroll();
        }
    }, [layoutState.staticMenuMobileActive]);

    useEffect(() => {
        if (layoutState.profileSidebarVisible) {
            bindProfileMenuOutsideClickListener();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [layoutState.profileSidebarVisible]);

    useUnmountEffect(() => {
        unbindProfileMenuOutsideClickListener();
    });

    const containerClass = classNames('layout-wrapper', {
        'layout-overlay': layoutConfig.menuMode === 'overlay',
        'layout-static': layoutConfig.menuMode === 'static',
        'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive,
        'layout-mobile-active': layoutState.staticMenuMobileActive,
        'p-input-filled': layoutConfig.inputStyle === 'filled',
        'p-ripple-disabled': !layoutConfig.ripple
    });

    return (
        <>
            <div className={containerClass}>
                <AppTopbarSimple ref={topbarRef} />
                <div className="layout-top-container">
                    <div className="layout-main">{children}</div>
                    <AppFooter />
                </div>
                <div className="layout-mask"></div>
            </div>

            <ScrollTop target="window" threshold={100} />
        </>
    );
};

export default TopBarLayout;
