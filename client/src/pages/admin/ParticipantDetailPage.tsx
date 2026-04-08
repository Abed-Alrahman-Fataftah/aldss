import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { adminAPI } from '../../services/api'

export default function ParticipantDetailPage() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const [participant, setParticipant] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    adminAPI.getParticipantDetail(userId)
      .then(res => setParticipant(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>Loading...</div>
  if (!participant) return <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>Participant not found</div>

  const latestDQD = participant.dqdSnapshots?.[0]

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <div style={{ background: '#1F3864', color: 'white', padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={() => navigate('/admin')}
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '0.4rem 0.875rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          ← All participants
        </button>
        <div style={{ fontWeight: 600 }}>{participant.fullName}</div>
        <span style={{
          background: participant.group === 'INTERVENTION' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
          padding: '3px 10px',
          borderRadius: '20px',
          fontSize: '0.8rem'
        }}>
          {participant.group}
        </span>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem 2rem' }}>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total sessions', value: participant._count.sessions },
            { label: 'Total events', value: participant._count.events },
            { label: 'Surveys submitted', value: participant.surveys.length },
            { label: 'Current DQD', value: latestDQD ? latestDQD.dqdIndex.toFixed(2) : 'N/A' }
          ].map(s => (
            <div key={s.label} style={{ background: 'white', borderRadius: '10px', padding: '1rem 1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>{s.label}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1F3864' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* DQD History */}
        {participant.dqdSnapshots.length > 0 && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ color: '#1F3864', marginBottom: '1rem' }}>DQD History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {participant.dqdSnapshots.slice().reverse().map((snap: any) => (
                <div key={snap.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '0.85rem', color: '#888', minWidth: '60px' }}>Week {snap.weekNumber}</div>
                  <div style={{ flex: 1, height: '8px', background: '#eee', borderRadius: '4px' }}>
                    <div style={{
                      height: '8px',
                      borderRadius: '4px',
                      background: snap.dqdIndex > 0.6 ? '#e74c3c' : snap.dqdIndex > 0.4 ? '#e67e22' : '#27ae60',
                      width: `${snap.dqdIndex * 100}%`
                    }} />
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: snap.dqdIndex > 0.6 ? '#e74c3c' : '#444', minWidth: '40px' }}>
                    {snap.dqdIndex.toFixed(2)}
                  </div>
                  {snap.trajectoryType && (
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px', background: '#f0f0f0', color: '#555' }}>
                      {snap.trajectoryType}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weekly surveys */}
        {participant.surveys.filter((s: any) => s.surveyType === 'WEEKLY').length > 0 && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ color: '#1F3864', marginBottom: '1rem' }}>Weekly surveys</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left', color: '#888', fontWeight: 500 }}>Week</th>
                  <th style={{ padding: '0.5rem', textAlign: 'center', color: '#888', fontWeight: 500 }}>Motivation</th>
                  <th style={{ padding: '0.5rem', textAlign: 'center', color: '#888', fontWeight: 500 }}>Progress</th>
                  <th style={{ padding: '0.5rem', textAlign: 'center', color: '#888', fontWeight: 500 }}>Hours</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left', color: '#888', fontWeight: 500 }}>Challenge</th>
                </tr>
              </thead>
              <tbody>
                {participant.surveys
                  .filter((s: any) => s.surveyType === 'WEEKLY')
                  .map((survey: any) => (
                    <tr key={survey.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                      <td style={{ padding: '0.6rem 0.5rem', fontWeight: 500 }}>Week {survey.weekNumber}</td>
                      <td style={{ padding: '0.6rem 0.5rem', textAlign: 'center' }}>{survey.motivationScore || '—'}/10</td>
                      <td style={{ padding: '0.6rem 0.5rem', textAlign: 'center' }}>{survey.perceivedProgress || '—'}/10</td>
                      <td style={{ padding: '0.6rem 0.5rem', textAlign: 'center' }}>{survey.studyHours || '—'}</td>
                      <td style={{ padding: '0.6rem 0.5rem', color: '#666' }}>{survey.mainChallenge || '—'}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Recent sessions */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h3 style={{ color: '#1F3864', marginBottom: '1rem' }}>Recent sessions</h3>
          {participant.sessions.length === 0 ? (
            <p style={{ color: '#888' }}>No sessions recorded yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {participant.sessions.map((session: any) => (
                <div key={session.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0', borderBottom: '1px solid #f5f5f5', fontSize: '0.875rem' }}>
                  <div style={{ color: '#444', flex: 1 }}>{new Date(session.startedAt).toLocaleDateString()}</div>
                  <div style={{ color: '#888' }}>
                    {session.durationSeconds ? `${Math.round(session.durationSeconds / 60)} min` : 'In progress'}
                  </div>
                  {session.daysSinceLast !== null && (
                    <div style={{ color: session.daysSinceLast >= 5 ? '#e74c3c' : '#888', fontSize: '0.8rem' }}>
                      {session.daysSinceLast === 0 ? 'Same day' : `${session.daysSinceLast}d gap`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}