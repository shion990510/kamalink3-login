import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import '../styles/LoginPage.css';
export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const result = await authService.login(email, password);
            if (result.success) {
                navigate('/map');
            }
        }
        catch (err) {
            setError(err.response?.data?.message || 'ログインに失敗しました');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("div", { className: "login-container", children: _jsxs("div", { className: "login-box", children: [_jsx("h1", { children: "\u30B3\u30EC\u30AF\u30BF\u30FC\u7BA1\u7406\u30B7\u30B9\u30C6\u30E0" }), _jsx("p", { className: "subtitle", children: "\u30ED\u30B0\u30A4\u30F3" }), error && _jsx("div", { className: "error-message", children: error }), _jsxs("form", { onSubmit: handleLogin, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "email", children: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9" }), _jsx("input", { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "example@example.com", required: true, disabled: isLoading })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "password", children: "\u30D1\u30B9\u30EF\u30FC\u30C9" }), _jsx("input", { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "\u30D1\u30B9\u30EF\u30FC\u30C9\u3092\u5165\u529B", required: true, disabled: isLoading })] }), _jsx("button", { type: "submit", className: "login-button", disabled: isLoading, children: isLoading ? 'ログイン中...' : 'ログイン' })] }), _jsxs("p", { className: "signup-link", children: ["\u30A2\u30AB\u30A6\u30F3\u30C8\u3092\u304A\u6301\u3061\u3067\u306A\u3044\u65B9\u306F", _jsx(Link, { to: "/signup", children: "\u3053\u3061\u3089\u304B\u3089\u65B0\u898F\u767B\u9332" })] }), _jsxs("p", { className: "notice", children: ["\u203B \u65B0\u898F\u767B\u9332\u306B\u306F\u3054\u62DB\u5F85\u304C\u5FC5\u8981\u3067\u3059\u3002", _jsx("br", {}), "\u7BA1\u7406\u8005\u307E\u3067\u304A\u554F\u3044\u5408\u308F\u305B\u304F\u3060\u3055\u3044\u3002"] })] }) }));
}
