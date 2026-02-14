import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService, collectorService } from '../services/api'
import '../styles/AdminPage.css'

interface PendingCollector {
  email: string
  phoneNumber: string
  name: string
  requestedAt: string
}

interface Collector {
  email: string
  name: string
  status: 'active' | 'pending' | 'rejected'
  createdAt: string
}

export default function AdminPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [collectors, setCollectors] = useState<Collector[]>([])
  const [pendingCollectors, setPendingCollectors] = useState<PendingCollector[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/')
      return
    }
    setUser(currentUser)
    loadCollectors()
  }, [navigate])

  const loadCollectors = async () => {
    try {
      setError('')
      const data = await collectorService.getCollectors()
      setCollectors(data.collectors)
      setPendingCollectors(data.pending)
    } catch (err: any) {
      setError('コレクター情報の読み込みに失敗しました')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (email: string) => {
    try {
      await collectorService.approvePendingCollector(email)
      await loadCollectors()
    } catch (err: any) {
      setError('承認に失敗しました')
      console.error(err)
    }
  }

  const handleReject = async (email: string) => {
    try {
      await collectorService.rejectPendingCollector(email)
      await loadCollectors()
    } catch (err: any) {
      setError('却下に失敗しました')
      console.error(err)
    }
  }

  const handleLogout = () => {
    authService.logout()
    navigate('/')
  }

  if (isLoading) {
    return <div className="loading">読み込み中...</div>
  }

  return (
    <div className="admin-container">
      <nav className="navbar">
        <div className="navbar-content">
          <h1>コレクター管理システム - 管理画面</h1>
          <button onClick={handleLogout} className="logout-button">
            ログアウト
          </button>
        </div>
      </nav>

      <main className="admin-content">
        {error && <div className="error-message">{error}</div>}

        <section className="section">
          <h2>新規登録リクエスト ({pendingCollectors.length}件)</h2>
          {pendingCollectors.length === 0 ? (
            <p className="no-data">保留中のリクエストはありません</p>
          ) : (
            <div className="request-list">
              {pendingCollectors.map((request) => (
                <div key={request.email} className="request-item">
                  <div className="request-info">
                    <p><strong>名前:</strong> {request.name}</p>
                    <p><strong>メールアドレス:</strong> {request.email}</p>
                    <p><strong>電話番号:</strong> {request.phoneNumber}</p>
                    <p><strong>申請日:</strong> {new Date(request.requestedAt).toLocaleDateString('ja-JP')}</p>
                  </div>
                  <div className="request-actions">
                    <button
                      className="btn-approve"
                      onClick={() => handleApprove(request.email)}
                    >
                      承認
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => handleReject(request.email)}
                    >
                      却下
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="section">
          <h2>承認済みコレクター ({collectors.length}件)</h2>
          {collectors.length === 0 ? (
            <p className="no-data">コレクターはまだ登録されていません</p>
          ) : (
            <div className="collectors-table">
              <table>
                <thead>
                  <tr>
                    <th>メールアドレス</th>
                    <th>名前</th>
                    <th>ステータス</th>
                    <th>登録日</th>
                  </tr>
                </thead>
                <tbody>
                  {collectors.map((collector) => (
                    <tr key={collector.email}>
                      <td>{collector.email}</td>
                      <td>{collector.name}</td>
                      <td>
                        <span className={`status status-${collector.status}`}>
                          {collector.status === 'active' ? 'アクティブ' : 'その他'}
                        </span>
                      </td>
                      <td>{new Date(collector.createdAt).toLocaleDateString('ja-JP')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
