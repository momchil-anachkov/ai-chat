import {Inject, Injectable} from '@nestjs/common';
import {ChatRepository} from './chat.repository';
import {Client} from 'pg';
import {POSTGRES_CLIENT} from '../clients/postgres.client';
import {ChatMessage} from '../../chat/chat.types';

@Injectable()
export class PostgresChatRepository extends ChatRepository {
    constructor(
        @Inject(POSTGRES_CLIENT) private readonly postgres: Client,
    ) {
        super();
    }

    public async addMessageToChatRoom(message: ChatMessage): Promise<void> {
        const query = `
            INSERT INTO chat_messages(room, username, role, text)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const parameters = [message.room, message.username, message.role, message.text];
        await this.postgres.query(query, parameters);
    }

    async getAllMessages(): Promise<ChatMessage[]> {
        const query = `SELECT room, username, role, text FROM chat_messages ORDER BY id ASC;`
        const result = await this.postgres.query(query);
        return result.rows;
    }
}
