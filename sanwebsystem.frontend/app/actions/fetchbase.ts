import { redirect } from 'next/navigation';

export interface IFetchServiceParams {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  credentials?: RequestCredentials;
  token?: string | null;
  body?: BodyInit | string | null;
  responseType?: 'json' | 'text' | 'blob';
};

const fetchServiceBase = async ({ url, method, credentials, token, body, responseType }: IFetchServiceParams) => {

    const headers: Record<string, string> = { 'Content-Type': 'application/json; charset=UTF-8' };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    if (body === undefined)
        body = null;
    else if (body !== null && typeof body !== 'string') {
        body = JSON.stringify(body);
    }

    responseType ??= 'json';

    return await fetch(
        url, {
        method: method,
        credentials: credentials,
        headers: headers,
        body: body
    })
    .then((response: Response) => {
        if (!response.ok) {
            console.error('Falhou a requisição:', `${response.status}: ${response.statusText}`);

            if (response.status === 401)
                redirect(`/`);

            return null;
        }

        if (responseType === 'text')
            return response.text();
        else if (responseType === 'blob')
            return response.blob();
        else
            return response.json();
    })
    .catch((error: unknown) => {
        if (error instanceof Error)
            console.error('Erro capturado:', error.stack ? error.stack : error.message);
        else
            console.error('Erro capturado (tipo desconhecido):', error as string);
    });
};

export default fetchServiceBase;