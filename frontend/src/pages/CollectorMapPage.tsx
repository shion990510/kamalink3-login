import { useEffect, useState, useRef } from 'react'
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/api'
import '../styles/CollectorMapPage.css'

interface CurrentLocation {
  latitude: number
  longitude: number
  accuracy: number
}

export default function CollectorMapPage() {
  const [location, setLocation] = useState<CurrentLocation | null>(null)
  const [isSharing, setIsSharing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const watchIdRef = useRef<number | null>(null)
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  // デフォルト位置（鎌倉）
  const defaultLocation = {
    latitude: 35.3154,
    longitude: 139.5463,
    accuracy: 500,
  }

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
  })

  useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user) {
      navigate('/')
      return
    }

    // 初期位置を取得
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('位置情報取得成功:', position.coords)
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          })
          setIsLoading(false)
        },
        (err) => {
          console.error('位置情報取得エラー:', err)
          // エラー時はデフォルト位置を使用
          setLocation(defaultLocation)
          setError('現在地を取得できませんでした。デフォルト位置を表示します。')
          setIsLoading(false)
        },
        {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 0,
        }
      )
    } else {
      console.error('このブラウザは位置情報に対応していません')
      setLocation(defaultLocation)
      setError('このブラウザは位置情報に対応していません。デフォルト位置を表示します。')
      setIsLoading(false)
    }
  }, [navigate])

  const handleStartSharing = () => {
    if (!('geolocation' in navigator)) {
      setError('このブラウザは位置情報に対応していません。')
      return
    }

    setIsSharing(true)
    setError('')

    // リアルタイム位置情報の監視開始
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        }
        setLocation(newLocation)

        // バックエンドに位置情報を送信
        sendLocationToBackend(newLocation)
      },
      (err) => {
        setError('位置情報の取得に失敗しました。')
        console.error(err)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    )
  }

  const handleStopSharing = () => {
    setIsSharing(false)
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }

    // バックエンドに共有終了を通知
    notifyBackendSharingStop()
  }

  const sendLocationToBackend = async (loc: CurrentLocation) => {
    try {
      const token = authService.getToken()
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
      })
    } catch (err) {
      console.error('Failed to send location:', err)
    }
  }

  const notifyBackendSharingStop = async () => {
    try {
      const token = authService.getToken()
      await fetch(`${import.meta.env.VITE_API_URL}/locations/stop`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    } catch (err) {
      console.error('Failed to notify stop:', err)
    }
  }

  const handleLogout = () => {
    if (isSharing) {
      handleStopSharing()
    }
    authService.logout()
    navigate('/')
  }

  if (isLoading) {
    return <div className="loading">位置情報を取得中...</div>
  }

  return (
    <div className="collector-map-container">
      <nav className="navbar">
        <div className="navbar-content">
          <h1>マップ - 位置情報共有</h1>
          <div className="navbar-buttons">
            <button onClick={() => navigate('/dashboard')} className="dashboard-button">
              🏠 ダッシュボード
            </button>
            <button onClick={() => navigate('/events')} className="events-button">
              📅 イベントカレンダー
            </button>
            <button onClick={() => navigate('/board')} className="board-button">
              💬 掲示板
            </button>
            <button onClick={handleLogout} className="logout-button">
              ログアウト
            </button>
          </div>
        </div>
      </nav>

      <main className="map-content">
        <div className="map-wrapper">
          {isLoaded && location ? (
            <GoogleMap
              mapContainerClassName="map-container"
              center={{
                lat: location.latitude,
                lng: location.longitude,
              }}
              zoom={15}
            >
              <Marker
                position={{
                  lat: location.latitude,
                  lng: location.longitude,
                }}
                title="あなたの現在地"
                icon={
                  isSharing
                    ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                    : 'http://maps.google.com/mapfiles/ms/icons/grey-dot.png'
                }
              />
            </GoogleMap>
          ) : (
            <div className="loading">マップを読み込み中...</div>
          )}
        </div>

        <aside className="controls-panel">
          <div className="control-section">
            <h2>位置情報共有</h2>

            {error && <div className="error-message">{error}</div>}

            <div className="location-info">
              {location && (
                <>
                  <p>
                    <strong>現在地:</strong>
                  </p>
                  <p className="coordinates">
                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </p>
                  <p className="accuracy">
                    <strong>精度:</strong> ±{location.accuracy.toFixed(1)}m
                  </p>
                </>
              )}
            </div>

            <div className="status-indicator">
              <div className={`status ${isSharing ? 'sharing' : 'stopped'}`}>
                {isSharing ? '🔴 配信中' : '⚪ 停止中'}
              </div>
            </div>

            <div className="control-buttons">
              {!isSharing ? (
                <button onClick={handleStartSharing} className="btn btn-start">
                  共有スタート
                </button>
              ) : (
                <button onClick={handleStopSharing} className="btn btn-stop">
                  共有ストップ
                </button>
              )}
            </div>

            <p className="notice">
              ※ 共有スタート中は、リアルタイムで位置情報が更新・共有されます。
              一般ユーザーのマップに表示されます。
            </p>
          </div>

          <div className="info-section">
            <h3>使い方</h3>
            <ol>
              <li>「共有スタート」を押して位置情報の共有を開始</li>
              <li>あなたの位置情報がリアルタイムで更新される</li>
              <li>「共有ストップ」で共有を終了</li>
            </ol>
          </div>
        </aside>
      </main>
    </div>
  )
}
