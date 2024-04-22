import {Client} from 'pg';

export const POSTGRES_CLIENT = Symbol('postgres-client')
export async function postgresClientProvider() {
    const client = new Client({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT, 10),
        host: process.env.DB_HOST,
    });
    await client.connect();
    return client;
}
