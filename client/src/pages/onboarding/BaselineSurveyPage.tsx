import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { surveyAPI, eventAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const ScaleInput = ({ value, onChange }: { value: number | null, onChange: (v: number) => void }) => (
  <div className="scale-row">
    {[1,2,3,4,5,6,7,8,9,10].map(n => (
      <button
        key={n}
        className={`scale-btn ${value === n ? 'selected' : ''}`}
        onClick={() => onChange(n)}
        type="button"
      >
        {n}
      </button>
    ))}
  </div>
)

export default function BaselineSurveyPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    currentGoal: '',
    motivationScore: null as number | null,
    selfEfficacyScore: null as number | null,
    consistencyScore: null as number | null,
    biggestChallenge: '',
    priorExperience: '',
    whyJoining: ''
  })

  const update = (field: string, value: any) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async () => {
    if (!form.currentGoal || !form.motivationScore || !form.selfEfficacyScore || !form.consistencyScore) {
      setError('Please answer all required questions')
      return
    }

    setLoading(true)
    setError('')

    try {
      await surveyAPI.submit({
        surveyType: 'BASELINE',
        weekNumber: 0,
        motivationScore: form.motivationScore,
        perceivedProgress: form.selfEfficacyScore,
        responses: {
          currentGoal: form.currentGoal,
          selfEfficacyScore: form.selfEfficacyScore,
          consistencyScore: form.consistencyScore,
          biggestChallenge: form.biggestChallenge,
          priorExperience: form.priorExperience,
          whyJoining: form.whyJoining
        }
      })

      await eventAPI.log({
        eventType: 'CONTENT_VIEW',
        metadata: { action: 'baseline_survey_completed' }
      })

      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit survey')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="card card-wide">
        <h1>Before we begin</h1>
        <p>Help us understand your starting point. This takes about 3 minutes and will never be shared publicly.</p>

        {error && <div className="error">{error}</div>}

        <hr className="divider" />

        <div className="form-group">
          <label>What is your main learning goal for the next 2 months? *</label>
          <textarea
            value={form.currentGoal}
            onChange={e => update('currentGoal', e.target.value)}
            placeholder="e.g. Learn Python well enough to build a small project, improve my academic writing..."
            rows={3}
          />
        </div>

        <div className="form-group">
          <label>How motivated are you to achieve this goal right now? * <span className="text-muted">(1 = not at all, 10 = extremely)</span></label>
          <ScaleInput value={form.motivationScore} onChange={v => update('motivationScore', v)} />
        </div>

        <div className="form-group mt-2">
          <label>How confident are you in your ability to learn consistently? * <span className="text-muted">(1 = not confident, 10 = very confident)</span></label>
          <ScaleInput value={form.selfEfficacyScore} onChange={v => update('selfEfficacyScore', v)} />
        </div>

        <div className="form-group mt-2">
          <label>How consistent have you been with learning in the past 3 months? * <span className="text-muted">(1 = very inconsistent, 10 = very consistent)</span></label>
          <ScaleInput value={form.consistencyScore} onChange={v => update('consistencyScore', v)} />
        </div>

        <div className="form-group mt-2">
          <label>What has been your biggest challenge with learning consistency?</label>
          <select value={form.biggestChallenge} onChange={e => update('biggestChallenge', e.target.value)}>
            <option value="">Select the closest answer</option>
            <option value="time">Not enough time</option>
            <option value="motivation">Losing motivation quickly</option>
            <option value="too_many_choices">Too many options — hard to choose what to study</option>
            <option value="distraction">Distractions and procrastination</option>
            <option value="no_clear_path">No clear learning path</option>
            <option value="other">Something else</option>
          </select>
        </div>

        <div className="form-group">
          <label>How much prior experience do you have with online self-directed learning?</label>
          <select value={form.priorExperience} onChange={e => update('priorExperience', e.target.value)}>
            <option value="">Select one</option>
            <option value="none">None — this is my first time</option>
            <option value="some">Some — I have tried a few courses</option>
            <option value="experienced">Experienced — I learn online regularly</option>
          </select>
        </div>

        <div className="form-group">
          <label>Why did you decide to join this study?</label>
          <textarea
            value={form.whyJoining}
            onChange={e => update('whyJoining', e.target.value)}
            placeholder="Optional — share anything you'd like"
            rows={2}
          />
        </div>

        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saving your responses...' : 'Complete setup — go to my dashboard'}
        </button>
      </div>
    </div>
  )
}