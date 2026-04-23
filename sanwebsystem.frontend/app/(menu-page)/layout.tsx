import React from 'react';
import Layout from '../../layout/layout';
import { ScrollTop } from 'primereact/scrolltop';

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: Readonly<AppLayoutProps>) {
    return (
        <>
            <Layout>{children}</Layout>
            <ScrollTop target="window" threshold={100} />
        </>
    );
}
