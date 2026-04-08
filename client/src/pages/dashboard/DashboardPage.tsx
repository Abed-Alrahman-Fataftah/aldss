import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { contentAPI } from '../../services/api'

interface Track {
  id: string
  title: string
  description: string
  orderIndex: number
  _count: { modules: number }
}

const trackColors: Record<number, string> = {
  1: '#1F3864',
  2: '#2E75B6',
  3: '#1a7f5a',
  4: '#7B3FA0'
}

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null)

  useEffect(() => {
    contentAPI.getTracks()
      .then(res => setTracks(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleTrackSelect = (trackId: string) => {
    setSelectedTrack(trackId)
    navigate(`/track/${trackId}`)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>

      {/* Header */}
      <div style={{ background: '#1F3864', color: 'white', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>ALDSS</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Adaptive Learning Platform</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>Welcome, {user?.fullName}</span>
          <button
            onClick={logout}
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            Sign out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>

        {/* Welcome banner */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem 2rem', marginBottom: '2rem', borderLeft: '4px solid #2E75B6', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
          <h2 style={{ margin: 0, marginBottom: '0.4rem', color: '#1F3864' }}>Choose your learning track</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>
            Select a track to begin. You can switch tracks at any time — but try to stay consistent for the best results.
          </p>
        </div>

        {/* Track grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>Loading tracks...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            {tracks.map(track => (
              <div
                key={track.id}
                onClick={() => handleTrackSelect(track.id)}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                  border: '2px solid transparent',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = trackColors[track.orderIndex] || '#2E75B6'
                  ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent'
                  ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
                }}
              >
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: trackColors[track.orderIndex] || '#2E75B6',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '1.1rem'
                }}>
                  {track.orderIndex}
                </div>
                <h3 style={{ margin: 0, marginBottom: '0.5rem', color: '#1F3864', fontSize: '1rem' }}>
                  {track.title}
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {track.description}
                </p>
                <div style={{ fontSize: '0.8rem', color: '#888' }}>
                  {track._count.modules} module{track._count.modules !== 1 ? 's' : ''}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}