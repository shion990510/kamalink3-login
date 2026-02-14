import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Calendar from 'react-calendar'
import { authService, eventService } from '../services/api'
import '../styles/EventSchedulePage.css'
import 'react-calendar/dist/Calendar.css'

interface Event {
  id: string
  eventName: string
  eventDate: Date | string
  eventTime?: string
  approvedCount?: number
  pendingCount?: number
  rejectedCount?: number
  totalCount?: number
  isConfirmed?: boolean
  participants?: Record<string, string>
  participantDetails?: {
    approved: string[]
    pending: string[]
    rejected: string[]
  }
}

export default function EventSchedulePage() {
  const [events, setEvents] = useState<Event[]>([])
  const [userStatus, setUserStatus] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [clickedDate, setClickedDate] = useState<Date | null>(null)
  const [newEventName, setNewEventName] = useState('')
  const [newEventDate, setNewEventDate] = useState('')
  const [newEventTime, setNewEventTime] = useState('--:--')
  const navigate = useNavigate()

  useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user) {
      navigate('/login')
      return
    }
    fetchEvents()
  }, [navigate])

  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      const data = await eventService.getEvents()
      setEvents(data.events || [])
      const statusData = await eventService.getUserEventStatus()
      setUserStatus(statusData.userStatus || {})
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (eventId: string, status: 'approved' | 'rejected' | 'pending') => {
    try {
      // ローカルstateをすぐに更新（楽観的UI更新）
      setUserStatus(prev => ({ ...prev, [eventId]: status }))
      
      // バックグラウンドでAPIに送信
      await eventService.respondToEvent(eventId, status)
      
      // 成功したら最新データを取得
      fetchEvents()
    } catch (err) {
      // エラーの場合は元に戻す
      setUserStatus(prev => {
        const newStatus = { ...prev }
        delete newStatus[eventId]
        return newStatus
      })
      setError('状態の更新に失敗しました')
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('このイベントを削除しますか？')) {
      try {
        await eventService.deleteEvent(eventId)
        setSelectedEvent(null)
        setClickedDate(null)
        await fetchEvents()
      } catch (err: any) {
        console.error(err)
      }
    }
  }

  const handleCreateEvent = async () => {
    if (!newEventName || !newEventDate || newEventTime === '--:--') {
      setError('イベント名・開催日程・予定時間を入力してください')
      return
    }
    try {
      await eventService.createEvent(newEventName, newEventDate, newEventTime)
      setNewEventName('')
      setNewEventDate('')
      setNewEventTime('--:--')
      setClickedDate(null)
      await fetchEvents()
    } catch (err: any) {
      setError('イベント作成に失敗しました')
    }
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = typeof event.eventDate === 'string' ? new Date(event.eventDate) : event.eventDate
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      )
    })
  }

  const getDateTile = (props: any) => {
    const { date } = props
    const dayEvents = getEventsForDate(date)
    return (
      <div className="calendar-tile-content">
        {dayEvents.map(event => (
          <div key={event.id} className={`calendar-event-item ${userStatus[event.id] || 'pending'}`}>
            {event.eventTime ? `${event.eventTime} ` : ''}{event.eventName}
          </div>
        ))}
      </div>
    )
  }

  const handleDateClick = (date: Date) => {
    setClickedDate(date)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    setNewEventDate(`${year}-${month}-${day}`)
    const dayEvents = getEventsForDate(date)
    if (dayEvents.length > 0) {
      setSelectedEvent(dayEvents[0])
    } else {
      setSelectedEvent(null)
    }
  }

  if (isLoading) {
    return <div className="loading">読み込み中...</div>
  }

  return (
    <div className="event-schedule-container">
      <nav className="navbar">
        <div className="navbar-content">
          <h1>イベントカレンダー</h1>
          <div className="navbar-buttons">
            <button onClick={() => navigate('/dashboard')} className="dashboard-button">🏠 ダッシュボード</button>
            <button onClick={() => navigate('/map')} className="map-button">📍 マップ</button>
            <button onClick={() => navigate('/board')} className="board-button">💬 掲示板</button>
            <button onClick={() => { authService.logout(); navigate('/') }} className="logout-button">ログアウト</button>
          </div>
        </div>
      </nav>

      <main className="schedule-content">
        {error && <div className="error-message">{error}</div>}
        <div className="calendar-wrapper">
          <Calendar onChange={(value: any) => setSelectedDate(value)} value={selectedDate} tileContent={getDateTile} onClickDay={handleDateClick} locale="ja-JP" />
        </div>
      </main>

      {selectedEvent && clickedDate && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedEvent(null)}>✕</button>
            <h2>{clickedDate.toLocaleDateString('ja-JP')}</h2>
            <div className="event-detail-section">
              <h3>{selectedEvent.eventName}</h3>
              <p className="event-info-text">予定時間: {selectedEvent.eventTime} | 参加: {selectedEvent.approvedCount || 0}人 | 未定: {selectedEvent.pendingCount || 0}人 | 不参加: {selectedEvent.rejectedCount || 0}人</p>
              <div className="event-info">
                <h4>この日のイベント:</h4>
                <div className="participant-list">
                  <label>参加: {selectedEvent.participantDetails?.approved.length ? selectedEvent.participantDetails.approved.join('、') : 'なし'}</label>
                </div>
                <div className="participant-list">
                  <label>未定: {selectedEvent.participantDetails?.pending.length ? selectedEvent.participantDetails.pending.join('、') : 'なし'}</label>
                </div>
                <div className="participant-list">
                  <label>不参加: {selectedEvent.participantDetails?.rejected.length ? selectedEvent.participantDetails.rejected.join('、') : 'なし'}</label>
                </div>
              </div>
              <div className="button-group">
                {userStatus[selectedEvent.id] === 'pending' ? (
                  <>
                    <button onClick={() => handleStatusChange(selectedEvent.id, 'approved')} className="btn approved">参加</button>
                    <button onClick={() => handleStatusChange(selectedEvent.id, 'rejected')} className="btn rejected">不参加</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleStatusChange(selectedEvent.id, 'pending')} className={`btn ${userStatus[selectedEvent.id] === 'pending' ? 'active' : ''}`}>未定</button>
                    <button onClick={() => handleStatusChange(selectedEvent.id, 'approved')} className={`btn ${userStatus[selectedEvent.id] === 'approved' ? 'active' : ''}`}>参加</button>
                    <button onClick={() => handleStatusChange(selectedEvent.id, 'rejected')} className={`btn ${userStatus[selectedEvent.id] === 'rejected' ? 'active' : ''}`}>不参加</button>
                  </>
                )}
              </div>
              <button onClick={() => handleDeleteEvent(selectedEvent.id)} className="btn-delete">削除</button>
            </div>
          </div>
        </div>
      )}

      {!selectedEvent && clickedDate && (
        <div className="modal-overlay" onClick={() => setClickedDate(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setClickedDate(null)}>✕</button>
            <h2>{clickedDate.toLocaleDateString('ja-JP')}</h2>
            <div className="form-section">
              <h3>イベントを作成:</h3>
              <input type="text" placeholder="イベント名" value={newEventName} onChange={(e) => setNewEventName(e.target.value)} className="input" />
              <input type="date" value={newEventDate} onChange={(e) => setNewEventDate(e.target.value)} className="input" />
              <input type="time" value={newEventTime} onChange={(e) => setNewEventTime(e.target.value)} className="input" />
              <button onClick={handleCreateEvent} className="btn-submit">イベントを追加</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
