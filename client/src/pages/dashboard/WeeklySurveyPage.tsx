import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { surveyAPI, eventAPI } from '../../services/api'

const ScaleInput = ({
  value,
  onChange,
  low,
  high
}: {
  value: number | null
  onChange: (v: number) => void
  low: string
  high: string
}) => (
  <div>
    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
      {[1,2,3,4,5,6,7,8,9,10].map(n => (
        <button
          key={n}
          type="button"
          className={`scale-btn ${value === n ? 'selected' : ''}`}
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
      <span style={{ fontSize: '11px', color: '#888' }}>{low}</span>
      <span style={{ fontSize: '11px', color: '#888' }}>{high}</span>
    </div>
  </div>
)

export default function WeeklySurveyPage() {
  const navigate = useNavigate()
  const [weekNumber, setWeekNumber] = useState(1)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [alreadyDone, setAlreadyDone] = useState(false)

  const [form, setForm] = useState({
    perceivedProgress: null as number | null,
    motivationScore: null as number | null,
    consistencyRating: null as number | null,
    studyHours: '',
    mainChallenge: '',
    bestMoment: '',
    planNextWeek: ''
  })

  const update = (field: string, value: any) =>
    setForm(prev => ({ ...prev, [field]: value }))

  useEffect(() => {
    surveyAPI.getWeeklyStatus()
      .then(res => {
        if (!res.data.due) {
          setAlreadyDone(true)
        }
        setWeekNumber(res.data.weekNumber || 1)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async () => {
    if (!form.perceivedProgress || !form.motivationScore || !form.consistencyRating) {
      setError('Please answer all required questions')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      await surveyAPI.submit({
        surveyType: 'WEEKLY',
        weekNumber,
        perceivedProgress: form.perceivedProgress,
        motivationScore: form.motivationScore,
        studyHours: form.studyHours ? parseFloat(form.studyHours) : undefined,
        mainChallenge: form.mainChallenge,
        responses: {
          consistencyRating: form.consistencyRating,
          bestMoment: form.bestMoment,
          planNextWeek: form.planNextWeek
        }
      })

      await eventAPI.log({
        eventType: 'CONTENT_VIEW',
        metadata: {
          action: 'weekly_survey_completed',
          weekNumber
        }
      })

      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit survey')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="page"><div className="card"><p>Loading...</p></div></div>
  }

  if (alreadyDone) {
    return (
      <div className="page">
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
          <h1>Already submitted</h1>
          <p>You have already completed this week's check-in. Come back in a few days for your next one.</p>
          <button className="btn btn-primary mt-2" onClick={() => navigate('/dashboard')}>
            Back to dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="card card-wide">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <h1>Week {weekNumber} check-in</h1>
          <span style={{ background: '#EEF4FF', color: '#1F3864', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 500 }}>
            3 minutes
          </span>
        </div>
        <p>A quick reflection on your learning this week. Your honest answers make the research meaningful.</p>

        {error && <div className="error">{error}</div>}

        <hr className="divider" />

        <div className="form-group">
          <label>How much progress did you make toward your learning goal this week? *</label>
          <ScaleInput
            value={form.perceivedProgress}
            onChange={v => update('perceivedProgress', v)}
            low="No progress"
            high="Excellent progress"
          />
        </div>

        <div className="form-group mt-2">
          <label>How motivated do you feel about your learning right now? *</label>
          <ScaleInput
            value={form.motivationScore}
            onChange={v => update('motivationScore', v)}
            low="Not motivated"
            high="Highly motivated"
          />
        </div>

        <div className="form-group mt-2">
          <label>How consistent were you with your learning sessions this week? *</label>
          <ScaleInput
            value={form.consistencyRating}
            onChange={v => update('consistencyRating', v)}
            low="Very inconsistent"
            high="Very consistent"
          />
        </div>

        <div className="form-group mt-2">
          <label>Approximately how many hours did you study this week?</label>
          <input
            type="number"
            value={form.studyHours}
            onChange={e => update('studyHours', e.target.value)}
            placeholder="e.g. 4.5"
            min="0"
            max="80"
            step="0.5"
            style={{ maxWidth: '160px' }}
          />
        </div>

        <div className="form-group">
          <label>What was your biggest challenge this week?</label>
          <select value={form.mainChallenge} onChange={e => update('mainChallenge', e.target.value)}>
            <option value="">Select one</option>
            <option value="time">Not enough time</option>
            <option value="motivation">Hard to stay motivated</option>
            <option value="difficulty">Content was too difficult</option>
            <option value="distraction">Too many distractions</option>
            <option value="direction">Unsure what to study next</option>
            <option value="none">No major challenges</option>
          </select>
        </div>

        <div className="form-group">
          <label>What was your best learning moment this week? (optional)</label>
          <textarea
            value={form.bestMoment}
            onChange={e => update('bestMoment', e.target.value)}
            placeholder="Something that clicked, a module you enjoyed, a concept that made sense..."
            rows={2}
          />
        </div>

        <div className="form-group">
          <label>What is your plan for next week? (optional)</label>
          <textarea
            value={form.planNextWeek}
            onChange={e => update('planNextWeek', e.target.value)}
            placeholder="Which track or module will you focus on?"
            rows={2}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? 'Saving...' : 'Submit week ' + weekNumber + ' check-in'}
        </button>
      </div>
    </div>
  )
}