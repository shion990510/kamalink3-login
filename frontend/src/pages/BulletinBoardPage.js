import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authService } from '../services/api';
import '../styles/BulletinBoardPage.css';
export default function BulletinBoardPage() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const user = authService.getCurrentUser();
        if (!user) {
            navigate('/login');
            return;
        }
        fetchMessages();
    }, [navigate]);
    const fetchMessages = async () => {
        try {
            setIsLoading(true);
            const token = authService.getToken();
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/messages`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessages(response.data.messages || []);
        }
        catch (err) {
            console.error('Error fetching messages:', err);
            setError('メッセージの読み込みに失敗しました');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handlePostMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim())
            return;
        try {
            const token = authService.getToken();
            await axios.post(`${import.meta.env.VITE_API_URL}/messages`, { content: newMessage }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            setNewMessage('');
            await fetchMessages();
        }
        catch (err) {
            console.error('Error posting message:', err);
            setError('メッセージの送信に失敗しました');
        }
    };
    const handleLogout = () => {
        authService.logout();
        navigate('/');
    };
    if (isLoading) {
        return _jsx("div", { className: "loading", children: "\u8AAD\u307F\u8FBC\u307F\u4E2D..." });
    }
    return (_jsxs("div", { className: "bulletin-board-container", children: [_jsx("nav", { className: "navbar", children: _jsxs("div", { className: "navbar-content", children: [_jsx("h1", { children: "\u30B3\u30EC\u30AF\u30BF\u30FC\u63B2\u793A\u677F" }), _jsxs("div", { className: "navbar-buttons", children: [_jsx("button", { onClick: () => navigate('/dashboard'), className: "back-button", children: "\u2190 \u30C0\u30C3\u30B7\u30E5\u30DC\u30FC\u30C9\u306B\u623B\u308B" }), _jsx("button", { onClick: handleLogout, className: "logout-button", children: "\u30ED\u30B0\u30A2\u30A6\u30C8" })] })] }) }), _jsxs("main", { className: "board-content", children: [error && _jsx("div", { className: "error-message", children: error }), _jsxs("div", { className: "post-form-section", children: [_jsx("h2", { children: "\u65B0\u3057\u3044\u30E1\u30C3\u30BB\u30FC\u30B8\u3092\u6295\u7A3F" }), _jsxs("form", { onSubmit: handlePostMessage, className: "post-form", children: [_jsx("textarea", { value: newMessage, onChange: (e) => setNewMessage(e.target.value), placeholder: "\u30E1\u30C3\u30BB\u30FC\u30B8\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044...", className: "message-input", rows: 4 }), _jsx("button", { type: "submit", className: "submit-button", disabled: !newMessage.trim(), children: "\u6295\u7A3F\u3059\u308B" })] })] }), _jsxs("div", { className: "messages-section", children: [_jsx("h2", { children: "\u30E1\u30C3\u30BB\u30FC\u30B8\u4E00\u89A7" }), _jsx("div", { className: "messages-list", children: messages.length === 0 ? (_jsx("p", { className: "no-messages", children: "\u30E1\u30C3\u30BB\u30FC\u30B8\u306F\u307E\u3060\u3042\u308A\u307E\u305B\u3093" })) : (messages.map((msg) => (_jsxs("div", { className: "message-card", children: [_jsxs("div", { className: "message-header", children: [_jsx("span", { className: "author-name", children: msg.authorName }), _jsx("span", { className: "message-date", children: new Date(msg.createdAt).toLocaleString('ja-JP') })] }), _jsx("div", { className: "message-content", children: msg.content })] }, msg.id)))) })] })] })] }));
}
