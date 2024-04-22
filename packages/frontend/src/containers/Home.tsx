import React, {useEffect, useRef, useState} from 'react';
import './Home.css';
import ChatRoom from '../components/ChatRoom';
import {ChatHistory, ChatMessage} from '../chat.types';

function Home() {
    const [chatRoomsState, setChatRoomsState] = useState<{ [name: string]: ChatMessage[] }>({humans: [], robots: []});
    const [username] = useState(window.crypto.randomUUID().split('-')[0]);

    const wsRef = useRef<WebSocket>(null as unknown as WebSocket);

    useEffect(() => {
        if (!wsRef.current) {
            const ws = new WebSocket('wss://localhost:4000');
            wsRef.current = ws;

            ws.addEventListener('message', (wsMessage) => {
                try {
                    const message = JSON.parse(wsMessage.data);

                    if (message.event === 'chat-message') {
                        receiveChatMessage(message.data);
                    }

                    if (message.event === 'chat-history') {
                        receiveChatHistory(message.data);
                    }
                } catch (e) {
                    console.error(e);
                }
            });
        }
    }, []);

    function receiveChatHistory(messages: ChatHistory) {
        setChatRoomsState(messages);
    }

    function receiveChatMessage(message: ChatMessage) {
        const chatRoom: string = message.room;

        setChatRoomsState((currentChatRoomState: { [name: string]: ChatMessage[] }): { [name: string]: ChatMessage[] } => {
            if (currentChatRoomState[chatRoom]) {
                return {
                    ...currentChatRoomState,
                    [chatRoom]: [...currentChatRoomState[chatRoom], message]
                };
            } else {
                return currentChatRoomState;
            }
        });
    }

    function sendChatMessage(room: string, message: string) {
        wsRef.current.send(
            JSON.stringify({
                event: 'chat-message',
                data: {
                    room,
                    username,
                    text: message,
                },
            }),
        );
    }

    return (
        <div className="Home">
            <div className="username-box"><span className="username">Username</span>: {username}</div>
            <div className="chatroom-humans">
                <ChatRoom
                    watermark="humans"
                    roomId="humans"
                    onMessageSend={sendChatMessage}
                    messages={chatRoomsState.humans}
                ></ChatRoom>
            </div>
            <div className="chatroom-robots">
                <ChatRoom
                    watermark="humans & robots"
                    roomId="robots"
                    onMessageSend={sendChatMessage}
                    messages={chatRoomsState.robots}
                ></ChatRoom>
            </div>
        </div>
    );
}

export default Home;
