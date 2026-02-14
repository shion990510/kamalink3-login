import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/api'
import InstagramSection from '../components/InstagramSection'
import '../styles/DashboardPage.css'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      navigate('/')
      return
    }
    setUser(currentUser)
  }, [navigate])

  const handleLogout = () => {
    authService.logout()
    navigate('/')
  }

  const handleAdminAccess = () => {
    if (user?.role === 'admin') {
      navigate('/admin')
    }
  }

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-content">
          <h1>コレクター管理システム</h1>
          <button onClick={handleLogout} className="logout-button">
            ログアウト
          </button>
        </div>
      </nav>

      <main className="dashboard-content">
        <div className="welcome-section">
          <h2>ようこそ、{user?.name}さん</h2>
          <p>メールアドレス: {user?.email}</p>
          {user?.role === 'admin' && (
            <button onClick={handleAdminAccess} className="admin-button">
              管理画面へ
            </button>
          )}
        </div>

        <section className="info-section">
          <h3>アカウント情報</h3>
          <div className="info-card">
            <p><strong>ステータス:</strong> <span className="status-active">アクティブ</span></p>
            <p><strong>アカウント種別:</strong> {user?.role === 'admin' ? '管理者' : 'コレクター'}</p>
            <p><strong>登録日:</strong> {new Date(user?.createdAt).toLocaleDateString('ja-JP')}</p>
          </div>
        </section>

        <section className="quick-links">
          <h3>クイックリンク</h3>
          <div className="links-grid">
            <button onClick={() => navigate('/map')} className="link-button">
              📍 マップを表示
            </button>
            <button onClick={() => navigate('/events')} className="link-button">
              📅 イベントカレンダー
            </button>
            <button onClick={() => navigate('/board')} className="link-button">
              💬 掲示板
            </button>
          </div>
        </section>

        <InstagramSection />
      </main>
    </div>
  )
}
