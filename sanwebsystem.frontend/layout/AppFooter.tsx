'use client';

import Image from 'next/image';

const AppFooter = () => {
    return (
        <div className="layout-footer">
            <Image src={`/layout/images/logo_san.png`} height={15} alt="Logo" />
            <span className="text-xs font-medium ml-1">WEB SYSTEM</span>
        </div>
    );
};

export default AppFooter;
