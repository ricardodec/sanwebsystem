export interface IObjectForm<T> {
    isAlert: boolean;
    value: T | null;
    message: string;
}

export type ObjectForm<T> = IObjectForm<T>;
