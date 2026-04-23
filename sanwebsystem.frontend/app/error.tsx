'use client';

import { useEffect } from 'react';
import { NextResponse } from 'next/dist/server/web/spec-extension/response';

export default function RootError({ error }: { error: Error }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return NextResponse.redirect(new URL('/pages/error'));
}
