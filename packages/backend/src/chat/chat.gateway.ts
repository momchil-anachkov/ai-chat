import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
} from '@nestjs/websockets';
import WebSocket from 'ws';
import {ChatMessage, WsMessage, WsMessageSchema} from './chat.types';
import {Logger} from '@nestjs/common';
import {LanguageModelService} from '../language-model/language-model.service';
import {ChatRepository} from '../persistence/chat/chat.repository';
import {CHAT_HISTORY, CHAT_MESSAGE} from './chat.events';
import {ChatRoles} from './chat.roles';
import {ChatRoomNames} from './chat-room-names';

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly connectedClients: Set<WebSocket> = new Set<WebSocket>();
    private readonly roomToChatMessages: Map<string, ChatMessage[]> = new Map();

    constructor(
        private readonly logger: Logger,
        private readonly languageModel: LanguageModelService,
        private readonly chatRepository: ChatRepository,
    ) {
    }

    @SubscribeMessage('chat-message')
    async onEvent(client: WebSocket, message: WsMessage): Promise<void> {
        try {
            const parseResult: any = WsMessageSchema.safeParse(message);
            if (!parseResult.success) {
                this.logger.warn(parseResult.error);
                return;
            }

            const chatMessage: ChatMessage = {
                room: message.room,
                username: message.message.user,
                role: ChatRoles.USER,
                text: message.message.text,
            };

            await this.addMessageToChatRoom(chatMessage);

            for (const connectedClient of this.connectedClients) {
                connectedClient.send(JSON.stringify({ event: CHAT_MESSAGE, data: chatMessage }));
            }

            if (message.room === 'robots') {
                const conversationSoFar: ChatMessage[] = this.roomToChatMessages.get('robots');

                const aiResponse = await this.languageModel.respondInConversation(conversationSoFar);
                const aiChatMessage: ChatMessage = {
                    room: message.room,
                    username: 'AI Assistant',
                    role: ChatRoles.ASSISTANT,
                    text: aiResponse,
                };
                await this.addMessageToChatRoom(aiChatMessage);

                for (const client of this.connectedClients) {
                    this.sendMessage(client, { event: CHAT_MESSAGE, data: aiChatMessage });
                }
            }
        } catch (e) {
            this.logger.error(e.stack);
        }
    }

    async handleConnection(client: WebSocket, ...args: any[]): Promise<void> {
        this.connectedClients.add(client);
        // FIXME: The format here is kind of crap. Maybe have an object with a field for each room
        const allMessages = this.roomToChatMessages.get('humans').concat(this.roomToChatMessages.get('robots'));
        this.sendMessage(client, { event: CHAT_HISTORY, data: allMessages });
    }

    handleDisconnect(client: any): any {
        this.connectedClients.delete(client);
    }

    async afterInit(server: WebSocket.Server): Promise<void> {
        const allMessages = await this.chatRepository.getAllMessages();

        this.roomToChatMessages.set(ChatRoomNames.HUMANS, allMessages.filter((m) => m.room === ChatRoomNames.HUMANS));
        this.roomToChatMessages.set(ChatRoomNames.ROBOTS, allMessages.filter((m) => m.room === ChatRoomNames.ROBOTS));
    }

    private async addMessageToChatRoom(message: ChatMessage) {
        await this.chatRepository.addMessageToChatRoom(message);
        this.roomToChatMessages.set(message.room, [...this.roomToChatMessages.get(message.room), message])
    }

    private sendMessage(client: WebSocket, message: any) {
        client.send(JSON.stringify(message));
    }
}
