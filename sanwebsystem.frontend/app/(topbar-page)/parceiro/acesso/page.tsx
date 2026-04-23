'use client';

import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Tag } from 'primereact/tag';
import Image from 'next/image';
import Loading from '@ui/loading';
import fetchService from '@actions/fetch';
import { AuthContext, AuthType } from '@context/auth';

const AcessoParceiro = () => {

    type TipoLayout = 'grid' | 'list' | (string & Record<string, unknown>);

    const { auth, dispatch } = useContext(AuthContext);
    const router = useRouter();
    const [form, setForm] = useState<Control.IParceiro[]>([]);
    const [layout, setLayout] = useState<TipoLayout>('grid');

    useEffect(() => {
        dispatch({ type: AuthType.PARCEIRO, payload: null });
        
        fetchService({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/controle/parceiro/acesso`, method: `GET`, token: auth.token as string })
            .then((data: Control.IParceiro[] | null) => {
                setForm(data ?? []);
            })
            .finally(() => {
                Loading.hide();
            });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onParceiroClick = (parceiroId: number) => {
        Loading.show();

        fetchService({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/controle/parceiro`, method: `POST`, token: auth.token as string, body: parceiroId.toString() })
            .then((data: Control.IParceiro | null) => {
                if (data == null) {
                    Loading.hide();
                    return;
                }
                
                dispatch({ type: AuthType.PARCEIRO, payload: data });
                router.push('/dashboard');
            });
    };

    const header = () => {
        return (
            <div className="flex justify-content-between flex-wrap">
                <div className="flex align-items-center justify-content-start">
                    <span className="text-3xl">Área de acesso ao parceiro</span>
                </div>
                
                <div className="flex align-items-center justify-content-end">
                    <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
                </div>
            </div>
        );
    };

    const gridItem = (parceiro: Control.IParceiro) => {
        return (
            <Button className="col-12 sm:col-6 lg:col-12 xl:col-4 mt-2 p-2 border-0 surface-card border-round hover:surface-50 border-surface-section" key={parceiro.id} onClick={() => onParceiroClick(parceiro.id)}>
                <div className="w-full p-4 flex flex-column align-items-center gap-3">
                    {
                        parceiro.logo ?
                            <Image className="shadow-2 border-round" src={parceiro.logo} alt={parceiro.nome} />
                            :
                            <i className={"pi pi-building p-3 shadow-2 border-round"} style={{ fontSize: '2em', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
                    }
                    <div className="text-xl text-color font-bold">{parceiro.nome}</div>
                    <Tag value={parceiro.ativo ? "Ativo" : "Inativo"} severity={parceiro.ativo ? "success" : "warning"}></Tag>
                </div>
            </Button>
        );
    };

    const listItem = (parceiro: Control.IParceiro, index: number) => {
        return (
            <Button className={classNames("col-12 surface-card hover:surface-50 border-none", { 'border-top-1 surface-border': index !== 0 })} key={parceiro.id} onClick={() => onParceiroClick(parceiro.id)}>
                <div className='flex flex-column xl:flex-row xl:align-items-start mt-2 p-4 gap-4'>
                    <div className="sm:w-8rem xl:w-4rem ">
                        {
                            parceiro.logo ?
                                <Image className="shadow-2 block xl:block mx-auto border-round" src={parceiro.logo} alt={parceiro.nome} width={100} height={100} />
                                :
                                <i className={"pi pi-building p-3 shadow-2 block xl:block mx-auto border-round"} style={{ fontSize: '2em', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
                        }
                    </div>
                    <div className="flex flex-column sm:flex-row justify-content-between xl:align-items-between flex-1 gap-4">
                        <div className="text-xl font-bold text-color mt-3" style={{ fontSize: '2em' }}>{parceiro.nome}</div>
                        <div className="flex align-items-center gap-3">
                            <Tag value={parceiro.ativo ? "Ativo" : "Inativo"} severity={parceiro.ativo ? "success" : "warning"}></Tag>
                        </div>
                    </div>
                </div>
            </Button>
        );
    };
    
    const itemTemplate = (parceiro: Control.IParceiro, layout: TipoLayout | undefined, index: number) => {
        if (layout === 'list')
            return listItem(parceiro, index);
        else if (layout === 'grid')
            return gridItem(parceiro);
        else
            return <></>;
    };

    const listTemplate = (parceiros: Control.IParceiro[], layout: TipoLayout | undefined) => {
        return (
            <div className="grid grid-nogutter">
                {
                    parceiros.map((parceiro, index) => itemTemplate(parceiro, layout, index))
                }
            </div>
        );
    };

    return (
        <div className="card">
            <DataView
                value={form}
                layout={layout}
                header={header()}
                listTemplate={listTemplate}
                emptyMessage="Nenhum parceiro disponível"
            />
        </div>
    );
};

export default AcessoParceiro;
