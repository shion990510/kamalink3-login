import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import InstagramSection from '../components/InstagramSection';
import '../styles/PublicMapPage.css';
export default function PublicMapPage() {
    const [collectors, setCollectors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: apiKey,
    });
    const mapCenter = {
        lat: 35.6762,
        lng: 139.6503, // デフォルト：東京
    };
    const mapOptions = {
        zoom: 12,
        mapTypeId: 'roadmap',
    };
    useEffect(() => {
        // 定期的にコレクター位置情報を取得
        const fetchCollectors = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/locations/active`);
                const data = await response.json();
                setCollectors(data.collectors || []);
            }
            catch (error) {
                console.error('Failed to fetch collectors:', error);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchCollectors();
        const interval = setInterval(fetchCollectors, 5000); // 5秒ごとに更新
        return () => clearInterval(interval);
    }, []);
    if (isLoading) {
        return _jsx("div", { className: "loading", children: "\u8AAD\u307F\u8FBC\u307F\u4E2D..." });
    }
    return (_jsxs("div", { className: "public-map-container", children: [_jsx("nav", { className: "navbar", children: _jsxs("div", { className: "navbar-content", children: [_jsx("h1", { children: "\u30B3\u30EC\u30AF\u30BF\u30FC\u5171\u6709\u30DE\u30C3\u30D7" }), _jsx("button", { onClick: () => navigate('/login'), className: "login-button", children: "\u30B3\u30EC\u30AF\u30BF\u30FC\u3068\u3057\u3066\u30ED\u30B0\u30A4\u30F3" })] }) }), _jsxs("main", { className: "map-content", children: [_jsx("div", { className: "map-wrapper", children: isLoaded ? (_jsx(GoogleMap, { mapContainerClassName: "map-container", center: mapCenter, zoom: mapOptions.zoom, options: mapOptions, children: collectors.map((collector) => (_jsx(Marker, { position: {
                                    lat: collector.latitude,
                                    lng: collector.longitude,
                                }, title: `${collector.name} - ${collector.email}`, icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }, collector.id))) })) : (_jsx("div", { className: "loading", children: "\u30DE\u30C3\u30D7\u3092\u8AAD\u307F\u8FBC\u307F\u4E2D..." })) }), _jsxs("aside", { className: "sidebar", children: [_jsxs("div", { className: "collector-list", children: [_jsx("h2", { children: "\u5171\u6709\u4E2D\u306E\u30B3\u30EC\u30AF\u30BF\u30FC" }), collectors.length === 0 ? (_jsx("p", { className: "no-collectors", children: "\u5171\u6709\u4E2D\u306E\u30B3\u30EC\u30AF\u30BF\u30FC\u306F\u3044\u307E\u305B\u3093" })) : (_jsx("ul", { className: "collectors", children: collectors.map((collector) => (_jsx("li", { className: "collector-item", children: _jsxs("div", { className: "collector-info", children: [_jsx("h3", { children: collector.name }), _jsx("p", { className: "status", children: collector.isSharing ? '🔴 配信中' : '⚪ 停止中' }), _jsxs("p", { className: "updated", children: ["\u66F4\u65B0: ", new Date(collector.updatedAt).toLocaleTimeString('ja-JP')] })] }) }, collector.id))) }))] }), _jsxs("div", { className: "info-section", children: [_jsx("h3", { children: "\u3053\u306E\u30A2\u30D7\u30EA\u306B\u3064\u3044\u3066" }), _jsx("p", { children: "\u3053\u306E\u30DE\u30C3\u30D7\u3067\u306F\u3001\u30B3\u30EC\u30AF\u30BF\u30FC\u304C\u5171\u6709\u3057\u3066\u3044\u308B\u4F4D\u7F6E\u60C5\u5831\u3092\u8868\u793A\u3057\u3066\u3044\u307E\u3059\u3002 \u9752\u3044\u70B9\u306F\u30EA\u30A2\u30EB\u30BF\u30A4\u30E0\u3067\u4F4D\u7F6E\u60C5\u5831\u3092\u5171\u6709\u4E2D\u306E\u30B3\u30EC\u30AF\u30BF\u30FC\u3067\u3059\u3002" }), _jsx("button", { onClick: () => navigate('/'), className: "cta-button", children: "\u30B3\u30EC\u30AF\u30BF\u30FC\u3068\u3057\u3066\u53C2\u52A0\u3059\u308B" })] })] })] }), _jsx(InstagramSection, {})] }));
}
