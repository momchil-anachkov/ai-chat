import {ChatMessage} from '../../chat/chat.types';

export abstract class ChatRepository {
    public abstract addMessageToChatRoom(message: ChatMessage): Promise<void>;
    public abstract getAllMessages(): Promise<ChatMessage[]>;
}
