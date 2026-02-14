import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import AdminPage from './pages/AdminPage'
import PublicMapPage from './pages/PublicMapPage'
import CollectorMapPage from './pages/CollectorMapPage'
import EventSchedulePage from './pages/EventSchedulePage'
import BulletinBoardPage from './pages/BulletinBoardPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicMapPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/map" element={<CollectorMapPage />} />
        <Route path="/events" element={<EventSchedulePage />} />
        <Route path="/board" element={<BulletinBoardPage />} />
      </Routes>
    </Router>
  )
}

export default App
