import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
} from '@nestjs/websockets';
import WebSocket from 'ws';
import {ChatMessage, IncomingMessage, IncomingMessageSchema} from './chat.types';
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
    async processChatMessage(client: WebSocket, rawMessage: IncomingMessage): Promise<void> {
        try {
            const parseResult: any = IncomingMessageSchema.safeParse(rawMessage);
            if (!parseResult.success) {
                this.logger.warn(parseResult.error);
                return;
            }

            const message = parseResult.data;

            await this.processHumanMessage(message);

            if (message.room === ChatRoomNames.ROBOTS) {
                await this.respondWithAssistantMessage();
            }
        } catch (e) {
            this.logger.error(e.stack);
        }
    }

    async processHumanMessage(incomingMessage: IncomingMessage) {
        const chatMessage: ChatMessage = {
            room: incomingMessage.room,
            username: incomingMessage.username,
            text: incomingMessage.text,
            role: ChatRoles.USER,
        };

        await this.addMessageToChatRoom(chatMessage);

        for (const client of this.connectedClients) {
            this.sendMessage(client, { event: CHAT_MESSAGE, data: chatMessage });
        }
    }

    async respondWithAssistantMessage() {
        const conversationSoFar: ChatMessage[] = this.roomToChatMessages.get(ChatRoomNames.ROBOTS);

        const aiResponse = await this.languageModel.respondInConversation(conversationSoFar);
        const aiChatMessage: ChatMessage = {
            room: ChatRoomNames.ROBOTS,
            username: 'AI Assistant',
            role: ChatRoles.ASSISTANT,
            text: aiResponse,
        };
        await this.addMessageToChatRoom(aiChatMessage);

        for (const client of this.connectedClients) {
            this.sendMessage(client, { event: CHAT_MESSAGE, data: aiChatMessage });
        }
    }

    async handleConnection(client: WebSocket, ...args: any[]): Promise<void> {
        this.connectedClients.add(client);
        const chatHistory = {
            [ChatRoomNames.HUMANS]: this.roomToChatMessages.get(ChatRoomNames.HUMANS),
            [ChatRoomNames.ROBOTS]: this.roomToChatMessages.get(ChatRoomNames.ROBOTS),
        }
        this.sendMessage(client, { event: CHAT_HISTORY, data: chatHistory });
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
