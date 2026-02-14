import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import { authService, eventService } from '../services/api';
import '../styles/EventSchedulePage.css';
import 'react-calendar/dist/Calendar.css';
export default function EventSchedulePage() {
    const [events, setEvents] = useState([]);
    const [userStatus, setUserStatus] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [clickedDate, setClickedDate] = useState(null);
    const [newEventName, setNewEventName] = useState('');
    const [newEventDate, setNewEventDate] = useState('');
    const [newEventTime, setNewEventTime] = useState('--:--');
    const navigate = useNavigate();
    useEffect(() => {
        const user = authService.getCurrentUser();
        if (!user) {
            navigate('/login');
            return;
        }
        fetchEvents();
    }, [navigate]);
    const fetchEvents = async () => {
        try {
            setIsLoading(true);
            const data = await eventService.getEvents();
            setEvents(data.events || []);
            const statusData = await eventService.getUserEventStatus();
            setUserStatus(statusData.userStatus || {});
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleStatusChange = async (eventId, status) => {
        try {
            // ローカルstateをすぐに更新（楽観的UI更新）
            setUserStatus(prev => ({ ...prev, [eventId]: status }));
            // バックグラウンドでAPIに送信
            await eventService.respondToEvent(eventId, status);
            // 成功したら最新データを取得
            fetchEvents();
        }
        catch (err) {
            // エラーの場合は元に戻す
            setUserStatus(prev => {
                const newStatus = { ...prev };
                delete newStatus[eventId];
                return newStatus;
            });
            setError('状態の更新に失敗しました');
        }
    };
    const handleDeleteEvent = async (eventId) => {
        if (window.confirm('このイベントを削除しますか？')) {
            try {
                await eventService.deleteEvent(eventId);
                setSelectedEvent(null);
                setClickedDate(null);
                await fetchEvents();
            }
            catch (err) {
                console.error(err);
            }
        }
    };
    const handleCreateEvent = async () => {
        if (!newEventName || !newEventDate || newEventTime === '--:--') {
            setError('イベント名・開催日程・予定時間を入力してください');
            return;
        }
        try {
            await eventService.createEvent(newEventName, newEventDate, newEventTime);
            setNewEventName('');
            setNewEventDate('');
            setNewEventTime('--:--');
            setClickedDate(null);
            await fetchEvents();
        }
        catch (err) {
            setError('イベント作成に失敗しました');
        }
    };
    const getEventsForDate = (date) => {
        return events.filter(event => {
            const eventDate = typeof event.eventDate === 'string' ? new Date(event.eventDate) : event.eventDate;
            return (eventDate.getFullYear() === date.getFullYear() &&
                eventDate.getMonth() === date.getMonth() &&
                eventDate.getDate() === date.getDate());
        });
    };
    const getDateTile = (props) => {
        const { date } = props;
        const dayEvents = getEventsForDate(date);
        return (_jsx("div", { className: "calendar-tile-content", children: dayEvents.map(event => (_jsxs("div", { className: `calendar-event-item ${userStatus[event.id] || 'pending'}`, children: [event.eventTime ? `${event.eventTime} ` : '', event.eventName] }, event.id))) }));
    };
    const handleDateClick = (date) => {
        setClickedDate(date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        setNewEventDate(`${year}-${month}-${day}`);
        const dayEvents = getEventsForDate(date);
        if (dayEvents.length > 0) {
            setSelectedEvent(dayEvents[0]);
        }
        else {
            setSelectedEvent(null);
        }
    };
    if (isLoading) {
        return _jsx("div", { className: "loading", children: "\u8AAD\u307F\u8FBC\u307F\u4E2D..." });
    }
    return (_jsxs("div", { className: "event-schedule-container", children: [_jsx("nav", { className: "navbar", children: _jsxs("div", { className: "navbar-content", children: [_jsx("h1", { children: "\u30A4\u30D9\u30F3\u30C8\u30AB\u30EC\u30F3\u30C0\u30FC" }), _jsxs("div", { className: "navbar-buttons", children: [_jsx("button", { onClick: () => navigate('/dashboard'), className: "dashboard-button", children: "\uD83C\uDFE0 \u30C0\u30C3\u30B7\u30E5\u30DC\u30FC\u30C9" }), _jsx("button", { onClick: () => navigate('/map'), className: "map-button", children: "\uD83D\uDCCD \u30DE\u30C3\u30D7" }), _jsx("button", { onClick: () => navigate('/board'), className: "board-button", children: "\uD83D\uDCAC \u63B2\u793A\u677F" }), _jsx("button", { onClick: () => { authService.logout(); navigate('/'); }, className: "logout-button", children: "\u30ED\u30B0\u30A2\u30A6\u30C8" })] })] }) }), _jsxs("main", { className: "schedule-content", children: [error && _jsx("div", { className: "error-message", children: error }), _jsx("div", { className: "calendar-wrapper", children: _jsx(Calendar, { onChange: setSelectedDate, value: selectedDate, tileContent: getDateTile, onClickDay: handleDateClick, locale: "ja-JP" }) })] }), selectedEvent && clickedDate && (_jsx("div", { className: "modal-overlay", onClick: () => setSelectedEvent(null), children: _jsxs("div", { className: "modal-content", onClick: (e) => e.stopPropagation(), children: [_jsx("button", { className: "modal-close", onClick: () => setSelectedEvent(null), children: "\u2715" }), _jsx("h2", { children: clickedDate.toLocaleDateString('ja-JP') }), _jsxs("div", { className: "event-detail-section", children: [_jsx("h3", { children: selectedEvent.eventName }), _jsxs("p", { className: "event-info-text", children: ["\u4E88\u5B9A\u6642\u9593: ", selectedEvent.eventTime, " | \u53C2\u52A0: ", selectedEvent.approvedCount || 0, "\u4EBA | \u672A\u5B9A: ", selectedEvent.pendingCount || 0, "\u4EBA | \u4E0D\u53C2\u52A0: ", selectedEvent.rejectedCount || 0, "\u4EBA"] }), _jsxs("div", { className: "event-info", children: [_jsx("h4", { children: "\u3053\u306E\u65E5\u306E\u30A4\u30D9\u30F3\u30C8:" }), _jsx("div", { className: "participant-list", children: _jsxs("label", { children: ["\u53C2\u52A0: ", selectedEvent.participantDetails?.approved.length ? selectedEvent.participantDetails.approved.join('、') : 'なし'] }) }), _jsx("div", { className: "participant-list", children: _jsxs("label", { children: ["\u672A\u5B9A: ", selectedEvent.participantDetails?.pending.length ? selectedEvent.participantDetails.pending.join('、') : 'なし'] }) }), _jsx("div", { className: "participant-list", children: _jsxs("label", { children: ["\u4E0D\u53C2\u52A0: ", selectedEvent.participantDetails?.rejected.length ? selectedEvent.participantDetails.rejected.join('、') : 'なし'] }) })] }), _jsx("div", { className: "button-group", children: userStatus[selectedEvent.id] === 'pending' ? (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => handleStatusChange(selectedEvent.id, 'approved'), className: "btn approved", children: "\u53C2\u52A0" }), _jsx("button", { onClick: () => handleStatusChange(selectedEvent.id, 'rejected'), className: "btn rejected", children: "\u4E0D\u53C2\u52A0" })] })) : (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => handleStatusChange(selectedEvent.id, 'pending'), className: `btn ${userStatus[selectedEvent.id] === 'pending' ? 'active' : ''}`, children: "\u672A\u5B9A" }), _jsx("button", { onClick: () => handleStatusChange(selectedEvent.id, 'approved'), className: `btn ${userStatus[selectedEvent.id] === 'approved' ? 'active' : ''}`, children: "\u53C2\u52A0" }), _jsx("button", { onClick: () => handleStatusChange(selectedEvent.id, 'rejected'), className: `btn ${userStatus[selectedEvent.id] === 'rejected' ? 'active' : ''}`, children: "\u4E0D\u53C2\u52A0" })] })) }), _jsx("button", { onClick: () => handleDeleteEvent(selectedEvent.id), className: "btn-delete", children: "\u524A\u9664" })] })] }) })), !selectedEvent && clickedDate && (_jsx("div", { className: "modal-overlay", onClick: () => setClickedDate(null), children: _jsxs("div", { className: "modal-content", onClick: (e) => e.stopPropagation(), children: [_jsx("button", { className: "modal-close", onClick: () => setClickedDate(null), children: "\u2715" }), _jsx("h2", { children: clickedDate.toLocaleDateString('ja-JP') }), _jsxs("div", { className: "form-section", children: [_jsx("h3", { children: "\u30A4\u30D9\u30F3\u30C8\u3092\u4F5C\u6210:" }), _jsx("input", { type: "text", placeholder: "\u30A4\u30D9\u30F3\u30C8\u540D", value: newEventName, onChange: (e) => setNewEventName(e.target.value), className: "input" }), _jsx("input", { type: "date", value: newEventDate, onChange: (e) => setNewEventDate(e.target.value), className: "input" }), _jsx("input", { type: "time", value: newEventTime, onChange: (e) => setNewEventTime(e.target.value), className: "input" }), _jsx("button", { onClick: handleCreateEvent, className: "btn-submit", children: "\u30A4\u30D9\u30F3\u30C8\u3092\u8FFD\u52A0" })] })] }) }))] }));
}
