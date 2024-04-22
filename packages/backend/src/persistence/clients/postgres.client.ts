import {Client} from 'pg';

export const POSTGRES_CLIENT = Symbol('postgres-client')
export async function postgresClientProvier() {
    const client = new Client({
        user: 'postgres',
        password: 'root',
        database: 'ai-chat',
        port: 5432,
        host: 'database',
    });
    await client.connect();
    return client;
}