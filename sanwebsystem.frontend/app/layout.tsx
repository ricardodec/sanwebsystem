'use client';

import React, { Suspense } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { LayoutProvider } from '../layout/context/layoutcontext';
import Loading from './ui/loading';
import { AuthProvider } from './context/auth';

import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import '@/styles/global.css';
import '@/styles/layout/layout.scss';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Suspense fallback={Loading.render()}>
            <html lang="pt-BR" className="light" suppressHydrationWarning>
                <body>
                    <PrimeReactProvider>
                        <AuthProvider>
                            <LayoutProvider>{children}</LayoutProvider>
                        </AuthProvider>
                    </PrimeReactProvider>
                </body>
            </html>
        </Suspense>
    );
}
