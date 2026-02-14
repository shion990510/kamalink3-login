import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState, useRef } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import '../styles/CollectorMapPage.css';
export default function CollectorMapPage() {
    const [location, setLocation] = useState(null);
    const [isSharing, setIsSharing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const watchIdRef = useRef(null);
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    // デフォルト位置（鎌倉）
    const defaultLocation = {
        latitude: 35.3154,
        longitude: 139.5463,
        accuracy: 500,
    };
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: apiKey,
    });
    useEffect(() => {
        const user = authService.getCurrentUser();
        if (!user) {
            navigate('/');
            return;
        }
        // 初期位置を取得
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                console.log('位置情報取得成功:', position.coords);
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                });
                setIsLoading(false);
            }, (err) => {
                console.error('位置情報取得エラー:', err);
                // エラー時はデフォルト位置を使用
                setLocation(defaultLocation);
                setError('現在地を取得できませんでした。デフォルト位置を表示します。');
                setIsLoading(false);
            }, {
                enableHighAccuracy: false,
                timeout: 15000,
                maximumAge: 0,
            });
        }
        else {
            console.error('このブラウザは位置情報に対応していません');
            setLocation(defaultLocation);
            setError('このブラウザは位置情報に対応していません。デフォルト位置を表示します。');
            setIsLoading(false);
        }
    }, [navigate]);
    const handleStartSharing = () => {
        if (!('geolocation' in navigator)) {
            setError('このブラウザは位置情報に対応していません。');
            return;
        }
        setIsSharing(true);
        setError('');
        // リアルタイム位置情報の監視開始
        watchIdRef.current = navigator.geolocation.watchPosition((position) => {
            const newLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
            };
            setLocation(newLocation);
            // バックエンドに位置情報を送信
            sendLocationToBackend(newLocation);
        }, (err) => {
            setError('位置情報の取得に失敗しました。');
            console.error(err);
        }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        });
    };
    const handleStopSharing = () => {
        setIsSharing(false);
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        // バックエンドに共有終了を通知
        notifyBackendSharingStop();
    };
    const sendLocationToBackend = async (loc) => {
        try {
            const token = authService.getToken();
            await fetch(`${import.meta.env.VITE_API_URL}/locations/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    latitude: loc.latitude,
                    longitude: loc.longitude,
                    accuracy: loc.accuracy,
                }),
            });
        }
        catch (err) {
            console.error('Failed to send location:', err);
        }
    };
    const notifyBackendSharingStop = async () => {
        try {
            const token = authService.getToken();
            await fetch(`${import.meta.env.VITE_API_URL}/locations/stop`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }
        catch (err) {
            console.error('Failed to notify stop:', err);
        }
    };
    const handleLogout = () => {
        if (isSharing) {
            handleStopSharing();
        }
        authService.logout();
        navigate('/');
    };
    if (isLoading) {
        return _jsx("div", { className: "loading", children: "\u4F4D\u7F6E\u60C5\u5831\u3092\u53D6\u5F97\u4E2D..." });
    }
    return (_jsxs("div", { className: "collector-map-container", children: [_jsx("nav", { className: "navbar", children: _jsxs("div", { className: "navbar-content", children: [_jsx("h1", { children: "\u30DE\u30C3\u30D7 - \u4F4D\u7F6E\u60C5\u5831\u5171\u6709" }), _jsxs("div", { className: "navbar-buttons", children: [_jsx("button", { onClick: () => navigate('/dashboard'), className: "dashboard-button", children: "\uD83C\uDFE0 \u30C0\u30C3\u30B7\u30E5\u30DC\u30FC\u30C9" }), _jsx("button", { onClick: () => navigate('/events'), className: "events-button", children: "\uD83D\uDCC5 \u30A4\u30D9\u30F3\u30C8\u30AB\u30EC\u30F3\u30C0\u30FC" }), _jsx("button", { onClick: () => navigate('/board'), className: "board-button", children: "\uD83D\uDCAC \u63B2\u793A\u677F" }), _jsx("button", { onClick: handleLogout, className: "logout-button", children: "\u30ED\u30B0\u30A2\u30A6\u30C8" })] })] }) }), _jsxs("main", { className: "map-content", children: [_jsx("div", { className: "map-wrapper", children: isLoaded && location ? (_jsx(GoogleMap, { mapContainerClassName: "map-container", center: {
                                lat: location.latitude,
                                lng: location.longitude,
                            }, zoom: 15, children: _jsx(Marker, { position: {
                                    lat: location.latitude,
                                    lng: location.longitude,
                                }, title: "\u3042\u306A\u305F\u306E\u73FE\u5728\u5730", icon: isSharing
                                    ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                                    : 'http://maps.google.com/mapfiles/ms/icons/grey-dot.png' }) })) : (_jsx("div", { className: "loading", children: "\u30DE\u30C3\u30D7\u3092\u8AAD\u307F\u8FBC\u307F\u4E2D..." })) }), _jsxs("aside", { className: "controls-panel", children: [_jsxs("div", { className: "control-section", children: [_jsx("h2", { children: "\u4F4D\u7F6E\u60C5\u5831\u5171\u6709" }), error && _jsx("div", { className: "error-message", children: error }), _jsx("div", { className: "location-info", children: location && (_jsxs(_Fragment, { children: [_jsx("p", { children: _jsx("strong", { children: "\u73FE\u5728\u5730:" }) }), _jsxs("p", { className: "coordinates", children: [location.latitude.toFixed(6), ", ", location.longitude.toFixed(6)] }), _jsxs("p", { className: "accuracy", children: [_jsx("strong", { children: "\u7CBE\u5EA6:" }), " \u00B1", location.accuracy.toFixed(1), "m"] })] })) }), _jsx("div", { className: "status-indicator", children: _jsx("div", { className: `status ${isSharing ? 'sharing' : 'stopped'}`, children: isSharing ? '🔴 配信中' : '⚪ 停止中' }) }), _jsx("div", { className: "control-buttons", children: !isSharing ? (_jsx("button", { onClick: handleStartSharing, className: "btn btn-start", children: "\u5171\u6709\u30B9\u30BF\u30FC\u30C8" })) : (_jsx("button", { onClick: handleStopSharing, className: "btn btn-stop", children: "\u5171\u6709\u30B9\u30C8\u30C3\u30D7" })) }), _jsx("p", { className: "notice", children: "\u203B \u5171\u6709\u30B9\u30BF\u30FC\u30C8\u4E2D\u306F\u3001\u30EA\u30A2\u30EB\u30BF\u30A4\u30E0\u3067\u4F4D\u7F6E\u60C5\u5831\u304C\u66F4\u65B0\u30FB\u5171\u6709\u3055\u308C\u307E\u3059\u3002 \u4E00\u822C\u30E6\u30FC\u30B6\u30FC\u306E\u30DE\u30C3\u30D7\u306B\u8868\u793A\u3055\u308C\u307E\u3059\u3002" })] }), _jsxs("div", { className: "info-section", children: [_jsx("h3", { children: "\u4F7F\u3044\u65B9" }), _jsxs("ol", { children: [_jsx("li", { children: "\u300C\u5171\u6709\u30B9\u30BF\u30FC\u30C8\u300D\u3092\u62BC\u3057\u3066\u4F4D\u7F6E\u60C5\u5831\u306E\u5171\u6709\u3092\u958B\u59CB" }), _jsx("li", { children: "\u3042\u306A\u305F\u306E\u4F4D\u7F6E\u60C5\u5831\u304C\u30EA\u30A2\u30EB\u30BF\u30A4\u30E0\u3067\u66F4\u65B0\u3055\u308C\u308B" }), _jsx("li", { children: "\u300C\u5171\u6709\u30B9\u30C8\u30C3\u30D7\u300D\u3067\u5171\u6709\u3092\u7D42\u4E86" })] })] })] })] })] }));
}
