import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

interface Overview {
  participants: { total: number; active: number; control: number; intervention: number }
  activity: { totalSessions: number; totalEvents: number; totalSurveys: number; totalInterventions: number; recentSessions: number }
  sentiment: { avgMotivation: number | null; avgProgress: number | null; surveyCount: number }
}

interface Participant {
  id: string
  fullName: string
  email: string
  group: string
  isActive: boolean
  enrolledAt: string
  fieldOfStudy: string
  daysSinceLastSeen: number | null
  atRisk: boolean
  lastSurveyWeek: number
  _count: { sessions: number; events: number; surveys: number; interventions: number }
}

const StatCard = ({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) => (
  <div style={{ background: 'white', borderRadius: '10px', padding: '1.25rem 1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
    <div style={{ fontSize: '0.8rem', color: '#888', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>{label}</div>
    <div style={{ fontSize: '2rem', fontWeight: 700, color: color || '#1F3864', marginBottom: '0.2rem' }}>{value}</div>
    {sub && <div style={{ fontSize: '0.8rem', color: '#888' }}>{sub}</div>}
  </div>
)

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [overview, setOverview] = useState<Overview | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'participants' | 'activity'>('overview')
  const [activity, setActivity] = useState<any[]>([])

  useEffect(() => {
    Promise.all([
      adminAPI.getOverview(),
      adminAPI.getParticipants()
    ]).then(([overviewRes, participantsRes]) => {
      setOverview(overviewRes.data)
      setParticipants(participantsRes.data)
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const loadActivity = () => {
    adminAPI.getRecentActivity()
      .then(res => setActivity(res.data))
      .catch(console.error)
  }

  const atRiskCount = participants.filter(p => p.atRisk).length
  const interventionGroup = participants.filter(p => p.group === 'INTERVENTION')
  const controlGroup = participants.filter(p => p.group === 'CONTROL')

  const tabStyle = (tab: string) => ({
    padding: '0.6rem 1.25rem',
    border: 'none',
    borderBottom: `2px solid ${activeTab === tab ? '#2E75B6' : 'transparent'}`,
    background: 'none',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: activeTab === tab ? 600 : 400,
    color: activeTab === tab ? '#1F3864' : '#888'
  })

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>

      {/* Header */}
      <div style={{ background: '#1F3864', color: 'white', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>ALDSS — Research Admin</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Study monitoring dashboard</div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            View as participant
          </button>
          <button
            onClick={logout}
            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: 'white', borderBottom: '1px solid #eee', padding: '0 2rem', display: 'flex', gap: '0.5rem' }}>
        <button style={tabStyle('overview')} onClick={() => setActiveTab('overview')}>Overview</button>
        <button style={tabStyle('participants')} onClick={() => setActiveTab('participants')}>
          Participants {atRiskCount > 0 && <span style={{ background: '#e74c3c', color: 'white', borderRadius: '10px', padding: '1px 7px', fontSize: '0.75rem', marginLeft: '6px' }}>{atRiskCount} at risk</span>}
        </button>
        <button style={tabStyle('activity')} onClick={() => { setActiveTab('activity'); loadActivity() }}>Live activity</button>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 2rem' }}>

        {loading && <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>Loading study data...</div>}

        {/* ── OVERVIEW TAB ── */}
        {!loading && activeTab === 'overview' && overview && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              <StatCard label="Total participants" value={overview.participants.total} sub={`${overview.participants.active} active`} />
              <StatCard label="Control group" value={overview.participants.control} sub="No AI guidance" />
              <StatCard label="Intervention group" value={overview.participants.intervention} sub="Receiving AI guidance" />
              <StatCard label="At risk" value={atRiskCount} sub="5+ days inactive" color={atRiskCount > 0 ? '#e74c3c' : '#27ae60'} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              <StatCard label="Total sessions" value={overview.activity.totalSessions} sub="All time" />
              <StatCard label="Sessions this week" value={overview.activity.recentSessions} sub="Last 7 days" />
              <StatCard label="Behavioral events" value={overview.activity.totalEvents} sub="Total logged" />
              <StatCard label="Surveys submitted" value={overview.activity.totalSurveys} sub="All types" />
            </div>

            {overview.sentiment.surveyCount > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: 'white', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#888', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                    Avg motivation this week
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#1F3864' }}>
                      {overview.sentiment.avgMotivation}/10
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ height: '8px', background: '#eee', borderRadius: '4px' }}>
                        <div style={{ height: '8px', background: '#2E75B6', borderRadius: '4px', width: `${(overview.sentiment.avgMotivation || 0) * 10}%` }} />
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '4px' }}>
                        From {overview.sentiment.surveyCount} survey{overview.sentiment.surveyCount !== 1 ? 's' : ''} this week
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ background: 'white', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#888', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                    Avg perceived progress this week
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#1F3864' }}>
                      {overview.sentiment.avgProgress}/10
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ height: '8px', background: '#eee', borderRadius: '4px' }}>
                        <div style={{ height: '8px', background: '#27ae60', borderRadius: '4px', width: `${(overview.sentiment.avgProgress || 0) * 10}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── PARTICIPANTS TAB ── */}
        {!loading && activeTab === 'participants' && (
          <div>
            {atRiskCount > 0 && (
              <div style={{ background: '#fff3f3', border: '1px solid #f5c6cb', borderRadius: '10px', padding: '1rem 1.5rem', marginBottom: '1.25rem' }}>
                <div style={{ fontWeight: 600, color: '#c0392b', marginBottom: '0.25rem' }}>
                  {atRiskCount} participant{atRiskCount !== 1 ? 's' : ''} at risk of dropping out
                </div>
                <div style={{ fontSize: '0.875rem', color: '#c0392b' }}>
                  These participants have not logged in for 5 or more days. Consider sending a re-engagement message.
                </div>
              </div>
            )}

            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa', borderBottom: '1px solid #eee' }}>
                    <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontWeight: 600, color: '#555' }}>Participant</th>
                    <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontWeight: 600, color: '#555' }}>Group</th>
                    <th style={{ padding: '0.875rem 1rem', textAlign: 'center', fontWeight: 600, color: '#555' }}>Sessions</th>
                    <th style={{ padding: '0.875rem 1rem', textAlign: 'center', fontWeight: 600, color: '#555' }}>Surveys</th>
                    <th style={{ padding: '0.875rem 1rem', textAlign: 'center', fontWeight: 600, color: '#555' }}>Last week</th>
                    <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontWeight: 600, color: '#555' }}>Last seen</th>
                    <th style={{ padding: '0.875rem 1rem', textAlign: 'center', fontWeight: 600, color: '#555' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p, i) => (
                    <tr
                      key={p.id}
                      style={{
                        borderBottom: '1px solid #f0f0f0',
                        background: p.atRisk ? '#fff8f8' : i % 2 === 0 ? 'white' : '#fafafa',
                        cursor: 'pointer'
                      }}
                      onClick={() => navigate(`/admin/participant/${p.id}`)}
                    >
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <div style={{ fontWeight: 500, color: '#1F3864' }}>{p.fullName}</div>
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>{p.fieldOfStudy || 'Not specified'}</div>
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <span style={{
                          background: p.group === 'INTERVENTION' ? '#EEF4FF' : '#f0fff4',
                          color: p.group === 'INTERVENTION' ? '#1F3864' : '#27ae60',
                          padding: '3px 10px',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: 500
                        }}>
                          {p.group === 'INTERVENTION' ? 'Intervention' : 'Control'}
                        </span>
                      </td>
                      <td style={{ padding: '0.875rem 1rem', textAlign: 'center', color: '#444' }}>{p._count.sessions}</td>
                      <td style={{ padding: '0.875rem 1rem', textAlign: 'center', color: '#444' }}>{p._count.surveys}</td>
                      <td style={{ padding: '0.875rem 1rem', textAlign: 'center', color: '#444' }}>
                        {p.lastSurveyWeek > 0 ? `Week ${p.lastSurveyWeek}` : 'None yet'}
                      </td>
                      <td style={{ padding: '0.875rem 1rem', color: p.atRisk ? '#e74c3c' : '#444' }}>
                        {p.daysSinceLastSeen === null
                          ? 'Never'
                          : p.daysSinceLastSeen === 0
                          ? 'Today'
                          : p.daysSinceLastSeen === 1
                          ? 'Yesterday'
                          : `${p.daysSinceLastSeen} days ago`}
                      </td>
                      <td style={{ padding: '0.875rem 1rem', textAlign: 'center' }}>
                        <span style={{
                          background: p.atRisk ? '#fff0f0' : '#f0fff4',
                          color: p.atRisk ? '#e74c3c' : '#27ae60',
                          padding: '3px 10px',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: 500
                        }}>
                          {p.atRisk ? 'At risk' : 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {participants.length === 0 && (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>
                  No participants enrolled yet. Share your registration link to get started.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ACTIVITY TAB ── */}
        {!loading && activeTab === 'activity' && (
          <div>
            <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <h2 style={{ color: '#1F3864', marginBottom: '1rem', fontSize: '1rem' }}>Last 50 behavioral events</h2>
              {activity.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>Loading activity...</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {activity.map(event => (
                    <div key={event.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.6rem 0', borderBottom: '1px solid #f5f5f5' }}>
                      <div style={{
                        background: '#EEF4FF',
                        color: '#1F3864',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        flexShrink: 0,
                        minWidth: '140px',
                        textAlign: 'center'
                      }}>
                        {event.eventType.replace(/_/g, ' ')}
                      </div>
                      <div style={{ flex: 1, fontSize: '0.875rem', color: '#444' }}>
                        {event.user?.fullName}
                        <span style={{ color: '#888', marginLeft: '6px', fontSize: '0.8rem' }}>
                          ({event.user?.group})
                        </span>
                      </div>
                      {event.depthScore !== null && (
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>
                          depth: {Math.round(event.depthScore * 100)}%
                        </div>
                      )}
                      <div style={{ fontSize: '0.8rem', color: '#aaa', flexShrink: 0 }}>
                        {new Date(event.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}