import React, {ChangeEvent, FormEvent, useRef, useState} from 'react';
import './ChatRoom.css';
import {ChatMessage} from '../chat.types';

function ChatRoom(props: ChatRoomProps) {
    console.log(`chatroom render ${props}`)

    const textareaRef = useRef<HTMLTextAreaElement>(null as unknown as HTMLTextAreaElement);

    function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const textArea = textareaRef.current;
        const currentMessage = textArea.value;
        props.onMessageSend(props.roomId, currentMessage);
        textArea.value = '';
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
            <form className="chat-box" onSubmit={onSubmit}>
                <textarea ref={textareaRef}></textarea>
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
