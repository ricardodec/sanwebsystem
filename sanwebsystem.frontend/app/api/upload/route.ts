// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const POST = async (request: Request) => {
    return new Response('Uoload realizado com sucesso', {
            status: 200,
            headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
};