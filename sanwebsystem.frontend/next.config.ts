import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    turbopack: {
        root: path.join(__dirname, ''),
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*', // Todas as requisições para /api/...
                destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`, // Serão redirecionadas para o backend
            },
        ];
    },
};

export default nextConfig;
