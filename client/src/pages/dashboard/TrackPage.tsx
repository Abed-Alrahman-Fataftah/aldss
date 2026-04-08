import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { contentAPI } from '../../services/api'

interface Module {
  id: string
  title: string
  description: string
  orderIndex: number
  _count: { quizzes: number }
}

interface Track {
  id: string
  title: string
  description: string
}

export default function TrackPage() {
  const { trackId } = useParams<{ trackId: string }>()
  const navigate = useNavigate()
  const [modules, setModules] = useState<Module[]>([])
  const [track, setTrack] = useState<Track | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!trackId) return
    Promise.all([
      contentAPI.getTracks(),
      contentAPI.getModules(trackId)
    ]).then(([tracksRes, modulesRes]) => {
      const found = tracksRes.data.find((t: Track) => t.id === trackId)
      setTrack(found || null)
      setModules(modulesRes.data)
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [trackId])

  const handleSwitchTrack = async () => {
    if (trackId) {
      await contentAPI.logPathSwitch(trackId, 'dashboard')
    }
    navigate('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <div style={{ background: '#1F3864', color: 'white', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={handleSwitchTrack}
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          ← All tracks
        </button>
        <div style={{ fontWeight: 700 }}>{track?.title || 'Loading...'}</div>
        <div style={{ width: '80px' }} />
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem' }}>
        {track && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={{ color: '#1F3864', marginBottom: '0.5rem' }}>{track.title}</h1>
            <p style={{ color: '#666' }}>{track.description}</p>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>Loading modules...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {modules.map((module, index) => (
              <div
                key={module.id}
                onClick={() => navigate(`/module/${module.id}`)}
                style={{
                  background: 'white',
                  borderRadius: '10px',
                  padding: '1.25rem 1.5rem',
                  cursor: 'pointer',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'all 0.15s',
                  border: '1.5px solid transparent'
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = '#2E75B6'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent'
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#EEF4FF',
                  color: '#1F3864',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  flexShrink: 0
                }}>
                  {index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#1F3864', marginBottom: '0.2rem' }}>{module.title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>{module.description}</div>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#888', flexShrink: 0 }}>
                  {module._count.quizzes} questions →
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}