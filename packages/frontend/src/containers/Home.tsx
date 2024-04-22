import React, {useEffect, useRef, useState} from 'react';
import './Home.css';
import ChatRoom from '../components/ChatRoom';
import {ChatMessage} from '../chat.types';

function Home() {
    const [chatRoomsState, setChatRoomsState] = useState<{[name: string]: ChatMessage[] }>({ humans: [], robots: [] });
    const [username] = useState(window.crypto.randomUUID().split('-')[0]);

    const wsRef = useRef<WebSocket>(null as unknown as WebSocket);

    useEffect(() => {
        // React.Strict renders twice

        if (!wsRef.current) {
            const ws = new WebSocket('wss://localhost:4000');
            wsRef.current = ws;

            ws.addEventListener('message', (wsMessage) => {
                try {
                    const message = JSON.parse(wsMessage.data);

                    if (message.event === 'message') {
                        const chatRoom: string = message.data.room;

                        setChatRoomsState((currentChatRoomState: { [name: string]: ChatMessage[] }): {[name: string]: ChatMessage[]} => {
                            if (currentChatRoomState[chatRoom]) {
                                currentChatRoomState[chatRoom].push(message.data);
                                return {...currentChatRoomState};
                            } else {
                                return currentChatRoomState;
                            }
                        });
                    }

                    if (message.event === 'chat-history') {
                        const chatMessages = message.data;
                        // const chatMessages = message.data.map((message: any) => ({ user: message.username, text: message.text, room: message.room, role: message.role }));
                        const humansChatMessages = chatMessages.filter((message: any) => message.room === 'humans');
                        const robotsChatMessages = chatMessages.filter((message: any) => message.room === 'robots');

                        console.log(humansChatMessages);
                        console.log(robotsChatMessages);

                        setChatRoomsState({ humans: humansChatMessages, robots: robotsChatMessages });
                    }

                } catch (e) {
                    console.error(e);
                }
            });
        }
    }, [])

    function onMessageSend(room: string, message: string) {
        // fetch('https://localhost:4000').then((response) => response.text()).then(console.log);
        wsRef.current.send(
            JSON.stringify({
                event: 'message',
                data: {
                    room,
                    message: { user: username, text: message },
                },
            }),
        );
    }

    return (
        <React.Fragment>
            <div className="Home">
                <div className="username">Username: {username}</div>
                <div className="chatroom-humans">
                    <ChatRoom
                        watermark="humans"
                        roomId="humans"
                        onMessageSend={onMessageSend}
                        messages={chatRoomsState.humans}
                    ></ChatRoom>
                </div>
                <div className="chatroom-robots">
                    <ChatRoom
                        watermark="humans & robots"
                        roomId="robots"
                        onMessageSend={onMessageSend}
                        messages={chatRoomsState.robots}
                    ></ChatRoom>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Home;
