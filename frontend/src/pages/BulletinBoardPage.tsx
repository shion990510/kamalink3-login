import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { authService } from '../services/api'
import '../styles/BulletinBoardPage.css'

interface Message {
  id: string
  authorName: string
  authorId: string
  content: string
  createdAt: string
}

export default function BulletinBoardPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user) {
      navigate('/login')
      return
    }
    fetchMessages()
  }, [navigate])

  const fetchMessages = async () => {
    try {
      setIsLoading(true)
      const token = authService.getToken()
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setMessages(response.data.messages || [])
    } catch (err: any) {
      console.error('Error fetching messages:', err)
      setError('メッセージの読み込みに失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePostMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      const token = authService.getToken()
      await axios.post(`${import.meta.env.VITE_API_URL}/messages`, 
        { content: newMessage },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setNewMessage('')
      await fetchMessages()
    } catch (err: any) {
      console.error('Error posting message:', err)
      setError('メッセージの送信に失敗しました')
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
    <div className="bulletin-board-container">
      <nav className="navbar">
        <div className="navbar-content">
          <h1>コレクター掲示板</h1>
          <div className="navbar-buttons">
            <button onClick={() => navigate('/dashboard')} className="back-button">
              ← ダッシュボードに戻る
            </button>
            <button onClick={handleLogout} className="logout-button">
              ログアウト
            </button>
          </div>
        </div>
      </nav>

      <main className="board-content">
        {error && <div className="error-message">{error}</div>}

        <div className="post-form-section">
          <h2>新しいメッセージを投稿</h2>
          <form onSubmit={handlePostMessage} className="post-form">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="メッセージを入力してください..."
              className="message-input"
              rows={4}
            />
            <button type="submit" className="submit-button" disabled={!newMessage.trim()}>
              投稿する
            </button>
          </form>
        </div>

        <div className="messages-section">
          <h2>メッセージ一覧</h2>
          <div className="messages-list">
            {messages.length === 0 ? (
              <p className="no-messages">メッセージはまだありません</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="message-card">
                  <div className="message-header">
                    <span className="author-name">{msg.authorName}</span>
                    <span className="message-date">{new Date(msg.createdAt).toLocaleString('ja-JP')}</span>
                  </div>
                  <div className="message-content">{msg.content}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
