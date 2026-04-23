import { ObjectList } from '.';
import { ReactNode } from 'react';

import {
    Page,
    AppBreadcrumbProps,
    Breadcrumb,
    BreadcrumbItem,
    MenuProps,
    MenuModel,
    LayoutConfig,
    LayoutState,
    Breadcrumb,
    LayoutContextProps,
    MailContextProps,
    MenuContextProps,
    ChatContextProps,
    TaskContextProps,
    AppConfigProps,
    NodeRef,
    AppTopbarRef,
    AppMenuItemProps,
    AppMenuItem,
} from '@/layout';

import { Auth } from '@/auth';

import { Control } from '@/control';

export interface IObjectForm<T> {
    isAlert: boolean;
    value: T | null;
    message: string;
}

type ObjectForm<T> = IObjectForm<T>;

export interface IObjectOption<T> {
    id: T;
    nome: string;
    descricao?: string;
}

type ObjectOption<T> = IObjectOption<T>;

export interface IObjectList<T> {
    limit: number;
    offset: number;
    qtde: number;
    ordem: string;
    ordemCrescente: boolean;
    ultimoRegistro: boolean;
    lista: T[] | null;
}

type ObjectList<T> = IObjectList<T>;

type ChildContainerProps = {
    children: ReactNode;
};

export type {
    Page,
    AppBreadcrumbProps,
    Breadcrumb,
    BreadcrumbItem,
    MenuProps,
    MenuModel,
    LayoutConfig,
    LayoutState,
    Breadcrumb,
    LayoutContextProps,
    MailContextProps,
    MenuContextProps,
    ChatContextProps,
    TaskContextProps,
    AppConfigProps,
    NodeRef,
    AppTopbarRef,
    AppMenuItemProps,
    ChildContainerProps,
    ObjectForm,
    ObjectOption,
    ObjectList,
    Auth,
    Control,
    Demo,
    LayoutType,
    SortOrderType,
    CustomEvent,
    ChartDataState,
    ChartOptionsState,
    AppMailSidebarItem,
    AppMailReplyProps,
    AppMailProps,
    AppMenuItem,
};
