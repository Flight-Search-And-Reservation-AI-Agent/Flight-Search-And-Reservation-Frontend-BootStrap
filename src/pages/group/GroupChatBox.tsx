import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client, over } from 'stompjs';
import { Button, Form, InputGroup } from 'react-bootstrap';

let stompClient: Client;

type ChatMessage = {
    sender: string;
    content: string;
    timestamp: string;
};

interface Props {
    groupId: string;
    currentUser: string;
}

const GroupChatBox: React.FC<Props> = ({ groupId, currentUser }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [message, setMessage] = useState('');

    const connect = () => {
        const socket = new SockJS('http://localhost:8080/ws'); // Backend websocket endpoint
        stompClient = over(socket);
        stompClient.connect({}, () => {
            stompClient.subscribe(`/topic/group/${groupId}/chat`, (payload: any) => {
                const msg: ChatMessage = JSON.parse(payload.body);
                setMessages((prev) => [...prev, msg]);
            });

        });
    };

    const sendMessage = () => {
        if (stompClient && message.trim()) {
            const chatMessage = {
                groupId,
                sender: currentUser,
                content: message,
                timestamp: new Date().toISOString(),
            };
            stompClient.send(`/app/chat.sendMessage/${groupId}`, {}, JSON.stringify(chatMessage));
            setMessage('');
        }
    };

    useEffect(() => {
        connect();
        return () => {
            if (stompClient?.connected) stompClient.disconnect(() => {
                console.log("Disconnected from WebSocket");
            });

        };
    }, []);

    return (
        <div className="p-3 border rounded bg-light" style={{ maxHeight: 300, overflowY: 'scroll' }}>
            <div className="mb-3">
                {messages.map((msg, index) => (
                    <div key={index} className="mb-2">
                        <strong>{msg.sender}:</strong> {msg.content}
                        <div style={{ fontSize: '0.75em', color: 'gray' }}>{new Date(msg.timestamp).toLocaleTimeString()}</div>
                    </div>
                ))}
            </div>
            <InputGroup>
                <Form.Control
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button variant="primary" onClick={sendMessage}>Send</Button>
            </InputGroup>
        </div>
    );
};

export default GroupChatBox;
