import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import InstagramSection from '../components/InstagramSection';
import '../styles/DashboardPage.css';
export default function DashboardPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
            navigate('/');
            return;
        }
        setUser(currentUser);
    }, [navigate]);
    const handleLogout = () => {
        authService.logout();
        navigate('/');
    };
    const handleAdminAccess = () => {
        if (user?.role === 'admin') {
            navigate('/admin');
        }
    };
    return (_jsxs("div", { className: "dashboard-container", children: [_jsx("nav", { className: "navbar", children: _jsxs("div", { className: "navbar-content", children: [_jsx("h1", { children: "\u30B3\u30EC\u30AF\u30BF\u30FC\u7BA1\u7406\u30B7\u30B9\u30C6\u30E0" }), _jsx("button", { onClick: handleLogout, className: "logout-button", children: "\u30ED\u30B0\u30A2\u30A6\u30C8" })] }) }), _jsxs("main", { className: "dashboard-content", children: [_jsxs("div", { className: "welcome-section", children: [_jsxs("h2", { children: ["\u3088\u3046\u3053\u305D\u3001", user?.name, "\u3055\u3093"] }), _jsxs("p", { children: ["\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9: ", user?.email] }), user?.role === 'admin' && (_jsx("button", { onClick: handleAdminAccess, className: "admin-button", children: "\u7BA1\u7406\u753B\u9762\u3078" }))] }), _jsxs("section", { className: "info-section", children: [_jsx("h3", { children: "\u30A2\u30AB\u30A6\u30F3\u30C8\u60C5\u5831" }), _jsxs("div", { className: "info-card", children: [_jsxs("p", { children: [_jsx("strong", { children: "\u30B9\u30C6\u30FC\u30BF\u30B9:" }), " ", _jsx("span", { className: "status-active", children: "\u30A2\u30AF\u30C6\u30A3\u30D6" })] }), _jsxs("p", { children: [_jsx("strong", { children: "\u30A2\u30AB\u30A6\u30F3\u30C8\u7A2E\u5225:" }), " ", user?.role === 'admin' ? '管理者' : 'コレクター'] }), _jsxs("p", { children: [_jsx("strong", { children: "\u767B\u9332\u65E5:" }), " ", new Date(user?.createdAt).toLocaleDateString('ja-JP')] })] })] }), _jsxs("section", { className: "quick-links", children: [_jsx("h3", { children: "\u30AF\u30A4\u30C3\u30AF\u30EA\u30F3\u30AF" }), _jsxs("div", { className: "links-grid", children: [_jsx("button", { onClick: () => navigate('/map'), className: "link-button", children: "\uD83D\uDCCD \u30DE\u30C3\u30D7\u3092\u8868\u793A" }), _jsx("button", { onClick: () => navigate('/events'), className: "link-button", children: "\uD83D\uDCC5 \u30A4\u30D9\u30F3\u30C8\u30AB\u30EC\u30F3\u30C0\u30FC" }), _jsx("button", { onClick: () => navigate('/board'), className: "link-button", children: "\uD83D\uDCAC \u63B2\u793A\u677F" })] })] }), _jsx(InstagramSection, {})] })] }));
}
