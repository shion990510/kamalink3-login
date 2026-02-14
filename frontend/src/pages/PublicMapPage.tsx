import { useEffect, useState } from 'react'
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api'
import { useNavigate } from 'react-router-dom'
import InstagramSection from '../components/InstagramSection'
import '../styles/PublicMapPage.css'

interface CollectorLocation {
  id: string
  email: string
  name: string
  latitude: number
  longitude: number
  updatedAt: string
  isSharing: boolean
}

export default function PublicMapPage() {
  const [collectors, setCollectors] = useState<CollectorLocation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
  })

  const mapCenter = {
    lat: 35.6762,
    lng: 139.6503, // デフォルト：東京
  }

  const mapOptions = {
    zoom: 12,
    mapTypeId: 'roadmap',
  }

  useEffect(() => {
    // 定期的にコレクター位置情報を取得
    const fetchCollectors = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/locations/active`)
        const data = await response.json()
        setCollectors(data.collectors || [])
      } catch (error) {
        console.error('Failed to fetch collectors:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCollectors()
    const interval = setInterval(fetchCollectors, 5000) // 5秒ごとに更新

    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return <div className="loading">読み込み中...</div>
  }

  return (
    <div className="public-map-container">
      <nav className="navbar">
        <div className="navbar-content">
          <h1>コレクター共有マップ</h1>
          <button onClick={() => navigate('/login')} className="login-button">
            コレクターとしてログイン
          </button>
        </div>
      </nav>

      <main className="map-content">
        <div className="map-wrapper">
          {isLoaded ? (
            <GoogleMap
              mapContainerClassName="map-container"
              center={mapCenter}
              zoom={mapOptions.zoom}
              options={mapOptions}
            >
              {collectors.map((collector) => (
                <Marker
                  key={collector.id}
                  position={{
                    lat: collector.latitude,
                    lng: collector.longitude,
                  }}
                  title={`${collector.name} - ${collector.email}`}
                  icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                />
              ))}
            </GoogleMap>
          ) : (
            <div className="loading">マップを読み込み中...</div>
          )}
        </div>

        <aside className="sidebar">
          <div className="collector-list">
            <h2>共有中のコレクター</h2>
            {collectors.length === 0 ? (
              <p className="no-collectors">共有中のコレクターはいません</p>
            ) : (
              <ul className="collectors">
                {collectors.map((collector) => (
                  <li key={collector.id} className="collector-item">
                    <div className="collector-info">
                      <h3>{collector.name}</h3>
                      <p className="status">
                        {collector.isSharing ? '🔴 配信中' : '⚪ 停止中'}
                      </p>
                      <p className="updated">
                        更新: {new Date(collector.updatedAt).toLocaleTimeString('ja-JP')}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="info-section">
            <h3>このアプリについて</h3>
            <p>
              このマップでは、コレクターが共有している位置情報を表示しています。
              青い点はリアルタイムで位置情報を共有中のコレクターです。
            </p>
            <button onClick={() => navigate('/')} className="cta-button">
              コレクターとして参加する
            </button>
          </div>
        </aside>
      </main>

      <InstagramSection />
    </div>
  )
}
