interface WsMessage {
    room: string;
    message: ChatMessage
}

export interface ChatMessage {
    username: string;
    role: string;
    text: string;
}
