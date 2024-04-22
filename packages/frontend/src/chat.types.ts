interface WsMessage {
    room: string;
    message: ChatMessage
}

export interface ChatMessage {
    room: string;
    username: string;
    role: string;
    text: string;
}
