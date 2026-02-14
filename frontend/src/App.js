import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import PublicMapPage from './pages/PublicMapPage';
import CollectorMapPage from './pages/CollectorMapPage';
import EventSchedulePage from './pages/EventSchedulePage';
import BulletinBoardPage from './pages/BulletinBoardPage';
function App() {
    return (_jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(PublicMapPage, {}) }), _jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/signup", element: _jsx(SignupPage, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "/admin", element: _jsx(AdminPage, {}) }), _jsx(Route, { path: "/map", element: _jsx(CollectorMapPage, {}) }), _jsx(Route, { path: "/events", element: _jsx(EventSchedulePage, {}) }), _jsx(Route, { path: "/board", element: _jsx(BulletinBoardPage, {}) })] }) }));
}
export default App;
