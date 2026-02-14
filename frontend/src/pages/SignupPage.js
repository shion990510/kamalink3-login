import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import '../styles/SignupPage.css';
export default function SignupPage() {
    const [formData, setFormData] = useState({
        phoneNumber: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const validateForm = () => {
        if (!formData.phoneNumber || !formData.name || !formData.email || !formData.password) {
            setError('すべてのフィールドを入力してください');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('パスワードが一致しません');
            return false;
        }
        if (formData.password.length < 8) {
            setError('パスワードは8文字以上で設定してください');
            return false;
        }
        if (!formData.email.includes('@')) {
            setError('正しいメールアドレスを入力してください');
            return false;
        }
        return true;
    };
    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!validateForm()) {
            return;
        }
        setIsLoading(true);
        try {
            const result = await authService.signup({
                phoneNumber: formData.phoneNumber,
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });
            if (result.success) {
                setSuccess('登録申請が完了しました。管理者の承認をお待ちください。');
                setFormData({
                    phoneNumber: '',
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                });
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            }
        }
        catch (err) {
            setError(err.response?.data?.message || '登録に失敗しました');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("div", { className: "signup-container", children: _jsxs("div", { className: "signup-box", children: [_jsx("h1", { children: "\u30B3\u30EC\u30AF\u30BF\u30FC\u7BA1\u7406\u30B7\u30B9\u30C6\u30E0" }), _jsx("p", { className: "subtitle", children: "\u65B0\u898F\u767B\u9332" }), error && _jsx("div", { className: "error-message", children: error }), success && _jsx("div", { className: "success-message", children: success }), _jsxs("form", { onSubmit: handleSignup, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "phoneNumber", children: "\u96FB\u8A71\u756A\u53F7" }), _jsx("input", { id: "phoneNumber", type: "tel", name: "phoneNumber", value: formData.phoneNumber, onChange: handleChange, placeholder: "09012345678", required: true, disabled: isLoading })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "name", children: "\u540D\u524D" }), _jsx("input", { id: "name", type: "text", name: "name", value: formData.name, onChange: handleChange, placeholder: "\u5C71\u7530\u592A\u90CE", required: true, disabled: isLoading })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "email", children: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9" }), _jsx("input", { id: "email", type: "email", name: "email", value: formData.email, onChange: handleChange, placeholder: "example@example.com", required: true, disabled: isLoading })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "password", children: "\u30D1\u30B9\u30EF\u30FC\u30C9" }), _jsx("input", { id: "password", type: "password", name: "password", value: formData.password, onChange: handleChange, placeholder: "8\u6587\u5B57\u4EE5\u4E0A\u3067\u8A2D\u5B9A", required: true, disabled: isLoading })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "confirmPassword", children: "\u30D1\u30B9\u30EF\u30FC\u30C9\uFF08\u78BA\u8A8D\uFF09" }), _jsx("input", { id: "confirmPassword", type: "password", name: "confirmPassword", value: formData.confirmPassword, onChange: handleChange, placeholder: "\u30D1\u30B9\u30EF\u30FC\u30C9\u3092\u518D\u5EA6\u5165\u529B", required: true, disabled: isLoading })] }), _jsx("button", { type: "submit", className: "signup-button", disabled: isLoading, children: isLoading ? '登録中...' : '新規登録' })] }), _jsxs("p", { className: "login-link", children: ["\u65E2\u306B\u30A2\u30AB\u30A6\u30F3\u30C8\u3092\u304A\u6301\u3061\u3067\u3059\u304B\uFF1F ", _jsx(Link, { to: "/", children: "\u30ED\u30B0\u30A4\u30F3\u3059\u308B" })] }), _jsxs("p", { className: "notice", children: ["\u203B \u65B0\u898F\u767B\u9332\u306B\u306F\u7BA1\u7406\u8005\u306E\u627F\u8A8D\u304C\u5FC5\u8981\u3067\u3059\u3002", _jsx("br", {}), "\u767B\u9332\u5F8C\u3001\u7BA1\u7406\u8005\u304B\u3089\u306E\u627F\u8A8D\u30E1\u30FC\u30EB\u3092\u304A\u5F85\u3061\u304F\u3060\u3055\u3044\u3002"] })] }) }));
}
