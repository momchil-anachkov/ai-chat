export interface ChatHistory {
    [room: string]: ChatMessage[]
}

export interface ChatMessage {
    room: string;
    username: string;
    role: string;
    text: string;
}
