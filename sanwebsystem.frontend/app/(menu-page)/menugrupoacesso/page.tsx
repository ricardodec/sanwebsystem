'use client';

import GrupoAcesso from '@topbar/grupoacesso/page';
import { connection } from 'next/server';

const GrupoAcessoParceiro = () => {
    connection();
    return <GrupoAcesso />;
};

export default GrupoAcessoParceiro;
