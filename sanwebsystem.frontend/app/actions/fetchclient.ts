'use client';

import fetchServiceBase, { IFetchServiceParams } from './fetchbase';

const fetchServiceClient = async ({ url, method, credentials = `omit`, token = null, body = null, responseType = 'json' }: IFetchServiceParams) => {
    return fetchServiceBase({ url: url, method: method, credentials: credentials, token: token, body: body, responseType: responseType});
}

export default fetchServiceClient;