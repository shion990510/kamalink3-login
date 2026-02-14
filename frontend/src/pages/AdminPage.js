import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, collectorService } from '../services/api';
import '../styles/AdminPage.css';
export default function AdminPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [collectors, setCollectors] = useState([]);
    const [pendingCollectors, setPendingCollectors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser || currentUser.role !== 'admin') {
            navigate('/');
            return;
        }
        setUser(currentUser);
        loadCollectors();
    }, [navigate]);
    const loadCollectors = async () => {
        try {
            setError('');
            const data = await collectorService.getCollectors();
            setCollectors(data.collectors);
            setPendingCollectors(data.pending);
        }
        catch (err) {
            setError('コレクター情報の読み込みに失敗しました');
            console.error(err);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleApprove = async (email) => {
        try {
            await collectorService.approvePendingCollector(email);
            await loadCollectors();
        }
        catch (err) {
            setError('承認に失敗しました');
            console.error(err);
        }
    };
    const handleReject = async (email) => {
        try {
            await collectorService.rejectPendingCollector(email);
            await loadCollectors();
        }
        catch (err) {
            setError('却下に失敗しました');
            console.error(err);
        }
    };
    const handleLogout = () => {
        authService.logout();
        navigate('/');
    };
    if (isLoading) {
        return _jsx("div", { className: "loading", children: "\u8AAD\u307F\u8FBC\u307F\u4E2D..." });
    }
    return (_jsxs("div", { className: "admin-container", children: [_jsx("nav", { className: "navbar", children: _jsxs("div", { className: "navbar-content", children: [_jsx("h1", { children: "\u30B3\u30EC\u30AF\u30BF\u30FC\u7BA1\u7406\u30B7\u30B9\u30C6\u30E0 - \u7BA1\u7406\u753B\u9762" }), _jsx("button", { onClick: handleLogout, className: "logout-button", children: "\u30ED\u30B0\u30A2\u30A6\u30C8" })] }) }), _jsxs("main", { className: "admin-content", children: [error && _jsx("div", { className: "error-message", children: error }), _jsxs("section", { className: "section", children: [_jsxs("h2", { children: ["\u65B0\u898F\u767B\u9332\u30EA\u30AF\u30A8\u30B9\u30C8 (", pendingCollectors.length, "\u4EF6)"] }), pendingCollectors.length === 0 ? (_jsx("p", { className: "no-data", children: "\u4FDD\u7559\u4E2D\u306E\u30EA\u30AF\u30A8\u30B9\u30C8\u306F\u3042\u308A\u307E\u305B\u3093" })) : (_jsx("div", { className: "request-list", children: pendingCollectors.map((request) => (_jsxs("div", { className: "request-item", children: [_jsxs("div", { className: "request-info", children: [_jsxs("p", { children: [_jsx("strong", { children: "\u540D\u524D:" }), " ", request.name] }), _jsxs("p", { children: [_jsx("strong", { children: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9:" }), " ", request.email] }), _jsxs("p", { children: [_jsx("strong", { children: "\u96FB\u8A71\u756A\u53F7:" }), " ", request.phoneNumber] }), _jsxs("p", { children: [_jsx("strong", { children: "\u7533\u8ACB\u65E5:" }), " ", new Date(request.requestedAt).toLocaleDateString('ja-JP')] })] }), _jsxs("div", { className: "request-actions", children: [_jsx("button", { className: "btn-approve", onClick: () => handleApprove(request.email), children: "\u627F\u8A8D" }), _jsx("button", { className: "btn-reject", onClick: () => handleReject(request.email), children: "\u5374\u4E0B" })] })] }, request.email))) }))] }), _jsxs("section", { className: "section", children: [_jsxs("h2", { children: ["\u627F\u8A8D\u6E08\u307F\u30B3\u30EC\u30AF\u30BF\u30FC (", collectors.length, "\u4EF6)"] }), collectors.length === 0 ? (_jsx("p", { className: "no-data", children: "\u30B3\u30EC\u30AF\u30BF\u30FC\u306F\u307E\u3060\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093" })) : (_jsx("div", { className: "collectors-table", children: _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9" }), _jsx("th", { children: "\u540D\u524D" }), _jsx("th", { children: "\u30B9\u30C6\u30FC\u30BF\u30B9" }), _jsx("th", { children: "\u767B\u9332\u65E5" })] }) }), _jsx("tbody", { children: collectors.map((collector) => (_jsxs("tr", { children: [_jsx("td", { children: collector.email }), _jsx("td", { children: collector.name }), _jsx("td", { children: _jsx("span", { className: `status status-${collector.status}`, children: collector.status === 'active' ? 'アクティブ' : 'その他' }) }), _jsx("td", { children: new Date(collector.createdAt).toLocaleDateString('ja-JP') })] }, collector.email))) })] }) }))] })] })] }));
}
