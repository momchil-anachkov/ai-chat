import {z} from 'zod';

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
    room: string,
    username: string,
    role: ChatRole,
    text: string,
}

export interface WsMessage {
    room: string;
    message: {
        user: string;
        text: string;
    }
}

export const WsMessageSchema = z.object({
   room: z.string(),
   message: z.object({
       user: z.string(),
       text: z.string(),
   })
});
