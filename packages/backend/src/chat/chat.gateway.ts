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

    @SubscribeMessage('message')
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
                role: 'user',
                text: message.message.text,
            };

            await this.addMessageToChatRoom(chatMessage);

            for (const connectedClient of this.connectedClients) {
                connectedClient.send(JSON.stringify({ event: 'message', data: chatMessage }));
            }

            if (message.room === 'robots') {
                // TODO: AI Should have the context of the entire conversation

                const conversationSoFar: ChatMessage[] = this.roomToChatMessages.get('robots');

                const aiResponse = await this.languageModel.respondInConversation(conversationSoFar);
                const aiChatMessage: ChatMessage = {
                    room: message.room,
                    username: 'AI Assistant',
                    role: 'assistant',
                    text: aiResponse,
                };
                await this.addMessageToChatRoom(aiChatMessage);

                for (const connectedClient of this.connectedClients) {
                    connectedClient.send(JSON.stringify({ event: 'message', data: aiChatMessage }));
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
        client.send(JSON.stringify({ event: 'chat-history', data: allMessages }));
    }

    handleDisconnect(client: any): any {
        this.connectedClients.delete(client);
    }

    async afterInit(server: WebSocket.Server): Promise<void> {
        const allMessages = await this.chatRepository.getAllMessages();

        // FIXME: Magic strings
        this.roomToChatMessages.set('robots', allMessages.filter((m) => m.room === 'robots'));
        this.roomToChatMessages.set('humans', allMessages.filter((m) => m.room === 'humans'));

    }

    private async addMessageToChatRoom(message: ChatMessage) {
        await this.chatRepository.addMessageToChatRoom(message);
        this.roomToChatMessages.set(message.room, [...this.roomToChatMessages.get(message.room), message])
    }
}
