import React, { useEffect, useRef, useState } from 'react';
import { Client, type IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type { ChatMessage } from '../../types';
import { fetchChatMessages } from '../../api/api';

interface Props {
    groupId: string;
    userId: string;
    username: string;
}

const GroupChat: React.FC<Props> = ({ groupId, userId, username }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const stompClient = useRef<Client | null>(null);
    const chatEndRef = useRef<HTMLDivElement | null>(null);
    // const jwtToken =localStorage.getItem("token")
    // Fetch old messages on mount
    useEffect(() => {
        fetchChatMessages(groupId)
            .then(setMessages)
            .catch((err) => console.error('Failed to fetch chat history:', err));
    }, [groupId]);

    // Connect WebSocket
    useEffect(() => {
        // Remove token from the URL
        const socketUrl = `https://flight-search-and-reservation-app.onrender.com/ws`;
        const socket = new SockJS(socketUrl);

        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log('Connected to WebSocket');
                client.subscribe(`/topic/group/${groupId}`, (msg: IMessage) => {
                    const message: ChatMessage = JSON.parse(msg.body);
                    setMessages(prev => [...prev, message]);
                });
            },
            onStompError: (frame) => {
                console.error('STOMP Error:', frame.headers['message']);
            },
            debug: (str) => console.log(str),
        });

        client.activate();
        stompClient.current = client;

        return () => {
            client.deactivate();
            console.log('WebSocket connection closed');
        };
    }, [groupId]);  // Remove jwtToken dependency since token is no longer used
    

    // Scroll to latest message
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (stompClient.current?.connected && newMessage.trim()) {
            const message: ChatMessage = {
                groupId,
                senderId: userId,
                senderUsername: username,
                content: newMessage.trim(),
                timestamp: new Date().toISOString(),
            };

            stompClient.current.publish({
                destination: '/app/sendMessage',
                body: JSON.stringify(message),
            });

            setNewMessage('');
        }
    };

    return (
        <div className="chat-container border p-3 rounded bg-light">
            <div className="chat-box overflow-auto mb-3" style={{ height: '300px' }}>
                {messages.map((msg, idx) => {
                    const isCurrentUser = msg.senderId === userId;
                    return (
                        <div
                            key={idx}
                            className={`d-flex mb-2 ${isCurrentUser ? 'justify-content-end' : 'justify-content-start'}`}
                        >
                            <div
                                style={{
                                    maxWidth: '70%',
                                    padding: '10px 15px',
                                    borderRadius: '20px',
                                    backgroundColor: isCurrentUser ? '#0d6efd' : '#e9ecef',
                                    color: isCurrentUser ? 'white' : 'black',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    wordBreak: 'break-word',
                                }}
                            >
                                <div style={{ fontWeight: '600', marginBottom: '4px', fontSize: '0.9rem' }}>
                                    {msg.senderUsername}
                                </div>
                                <div>{msg.content}</div>
                                <div style={{ fontSize: '0.7rem', color: isCurrentUser ? '#cce5ff' : '#6c757d', marginTop: '6px', textAlign: 'right' }}>
                                    {new Date(msg.timestamp || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={chatEndRef} />
            </div>

            <div className="input-group">
                <input
                    className="form-control"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button className="btn btn-primary" onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};

export default GroupChat;
