import {z} from 'zod';
import {ChatRoomNames} from './chat-room-names';

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
    room: string,
    username: string,
    role: ChatRole,
    text: string,
}

export const IncomingMessageSchema = z.object({
    room: z.enum([ChatRoomNames.HUMANS, ChatRoomNames.ROBOTS]),
    username: z.string(),
    text: z.string(),
});

export type IncomingMessage = z.infer<typeof IncomingMessageSchema>
