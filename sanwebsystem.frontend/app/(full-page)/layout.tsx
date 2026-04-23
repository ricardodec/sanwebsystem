import React from 'react';
import type { Metadata } from 'next';
import { ScrollTop } from 'primereact/scrolltop';

export const metadata: Metadata = {
    title: {
        template: '%s | SAN WEB SYSTEM',
        default: 'SAN WEB SYSTEM'
    },
    description: 'SAN WEB SYSTEM',
    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1
        }
    }
};

export default function SimpleLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {children}
            <ScrollTop target="window" threshold={100} />
        </>
    );
}
