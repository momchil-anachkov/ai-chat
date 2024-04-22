import {Client} from 'pg';

export const POSTGRES_CLIENT = Symbol('postgres-client')
export async function postgresClientProvier() {
    const client = new Client({
        user: 'postgres',
        password: 'root',
        database: 'bp-pg-db',
        port: 5432,
        host: 'bp-pg-db',
    });
    await client.connect();
    return client;
}