import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { surveyAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const ScaleInput = ({ value, onChange, low, high }: {
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

export default function ExitSurveyPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const [form, setForm] = useState({
    overallSatisfaction: null as number | null,
    perceivedImprovement: null as number | null,
    consistencyImprovement: null as number | null,
    platformUsefulness: null as number | null,
    guidanceHelpfulness: null as number | null,
    wouldRecommend: null as number | null,
    biggestLearning: '',
    whatWorked: '',
    whatDidntWork: '',
    additionalFeedback: ''
  })

  const update = (field: string, value: any) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async () => {
    if (!form.overallSatisfaction || !form.perceivedImprovement || !form.consistencyImprovement) {
      setError('Please answer all required questions')
      return
    }

    setLoading(true)
    setError('')

    try {
      await surveyAPI.submit({
        surveyType: 'EXIT',
        weekNumber: 99,
        perceivedProgress: form.perceivedImprovement,
        motivationScore: form.overallSatisfaction,
        responses: {
          overallSatisfaction: form.overallSatisfaction,
          perceivedImprovement: form.perceivedImprovement,
          consistencyImprovement: form.consistencyImprovement,
          platformUsefulness: form.platformUsefulness,
          guidanceHelpfulness: form.guidanceHelpfulness,
          wouldRecommend: form.wouldRecommend,
          biggestLearning: form.biggestLearning,
          whatWorked: form.whatWorked,
          whatDidntWork: form.whatDidntWork,
          additionalFeedback: form.additionalFeedback
        }
      })
      setSubmitted(true)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="page">
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
          <h1>Thank you for participating</h1>
          <p style={{ marginBottom: '1rem' }}>
            Your responses have been saved. You have completed the study and your contribution will directly support this research.
          </p>
          <p style={{ color: '#888', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Your behavioral data and survey responses will be anonymized and used in the thesis analysis. Thank you for your time and commitment.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
            Return to dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="card card-wide">
        <h1>Study exit survey</h1>
        <p>You have reached the end of the study period. This final survey takes about 5 minutes and is the most important data you will contribute to this research.</p>

        {error && <div className="error">{error}</div>}

        <hr className="divider" />

        <div className="form-group">
          <label>Overall, how satisfied are you with your experience on this platform? * </label>
          <ScaleInput value={form.overallSatisfaction} onChange={v => update('overallSatisfaction', v)} low="Very dissatisfied" high="Very satisfied" />
        </div>

        <div className="form-group mt-2">
          <label>How much do you feel you improved in your chosen learning area? *</label>
          <ScaleInput value={form.perceivedImprovement} onChange={v => update('perceivedImprovement', v)} low="No improvement" high="Significant improvement" />
        </div>

        <div className="form-group mt-2">
          <label>Compared to before the study, how much more consistent is your learning? *</label>
          <ScaleInput value={form.consistencyImprovement} onChange={v => update('consistencyImprovement', v)} low="Much less consistent" high="Much more consistent" />
        </div>

        <div className="form-group mt-2">
          <label>How useful was the platform for supporting your learning goals?</label>
          <ScaleInput value={form.platformUsefulness} onChange={v => update('platformUsefulness', v)} low="Not useful" high="Extremely useful" />
        </div>

        {user?.group === 'INTERVENTION' && (
          <div className="form-group mt-2">
            <label>How helpful were the AI guidance cards you received?</label>
            <ScaleInput value={form.guidanceHelpfulness} onChange={v => update('guidanceHelpfulness', v)} low="Not helpful" high="Very helpful" />
          </div>
        )}

        <div className="form-group mt-2">
          <label>How likely are you to recommend this type of platform to a friend?</label>
          <ScaleInput value={form.wouldRecommend} onChange={v => update('wouldRecommend', v)} low="Not at all likely" high="Extremely likely" />
        </div>

        <hr className="divider" />

        <div className="form-group">
          <label>What was your biggest learning or insight from this study?</label>
          <textarea value={form.biggestLearning} onChange={e => update('biggestLearning', e.target.value)} rows={3} placeholder="What did you learn about yourself as a learner?" />
        </div>

        <div className="form-group">
          <label>What worked well for you on this platform?</label>
          <textarea value={form.whatWorked} onChange={e => update('whatWorked', e.target.value)} rows={2} placeholder="What did you find most useful or engaging?" />
        </div>

        <div className="form-group">
          <label>What could be improved?</label>
          <textarea value={form.whatDidntWork} onChange={e => update('whatDidntWork', e.target.value)} rows={2} placeholder="What frustrated you or could work better?" />
        </div>

        <div className="form-group">
          <label>Any other feedback for the researcher?</label>
          <textarea value={form.additionalFeedback} onChange={e => update('additionalFeedback', e.target.value)} rows={2} placeholder="Anything else you want to share" />
        </div>

        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit final survey and complete the study'}
        </button>
      </div>
    </div>
  )
}