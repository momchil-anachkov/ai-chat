import React, {FormEvent, KeyboardEvent, useRef} from 'react';
import './ChatRoom.css';
import {ChatMessage} from '../chat.types';

function ChatRoom(props: ChatRoomProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null as unknown as HTMLTextAreaElement);
    const formRef = useRef<HTMLFormElement>(null as unknown as HTMLFormElement);

    function sendMessage() {
        const textArea = textareaRef.current;
        const currentMessage = textArea.value;
        props.onMessageSend(props.roomId, currentMessage);
        textArea.value = '';
    }

    function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        sendMessage();
    }

    function sendOnEnterKey(e: KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter') {
            e.preventDefault(); // Don't write a newline in the textarea
            sendMessage();
        }
    }

    return (
        <div className="ChatRoom">
            <div className="messages-box-container">
                <div className="watermark">{props.watermark}</div>
                <div className="messages-box">
                    {props.messages.map((message, index) =>
                        <div key={index} className="message-line"><span className={message.role}>{message.username}</span>: {message.text}</div>
                    )}
                </div>
            </div>
            <form ref={formRef} className="chat-box" onSubmit={onSubmit}>
                <textarea ref={textareaRef} onKeyDown={sendOnEnterKey}></textarea>
                <button type="submit">Send</button>
            </form>
        </div>
    );
}

export interface ChatRoomProps {
    watermark: string;
    roomId: string;
    messages: ChatMessage[],
    onMessageSend: (roomId: string, message: string) => void;
}

export default ChatRoom;
