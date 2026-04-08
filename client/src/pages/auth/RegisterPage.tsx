import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { setUserFromRegister } = useAuth()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    ageRange: '',
    studyLevel: '',
    fieldOfStudy: '',
    weeklyStudyHours: '',
    consentGiven: false
  })

  const update = (field: string, value: any) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleStep1 = () => {
    if (!form.fullName || !form.email || !form.password) {
      setError('Please fill in all required fields')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setError('')
    setStep(2)
  }

  const handleStep2 = () => {
    if (!form.ageRange || !form.studyLevel || !form.fieldOfStudy) {
      setError('Please fill in all fields')
      return
    }
    setError('')
    setStep(3)
  }

  const handleSubmit = async () => {
    if (!form.consentGiven) {
      setError('You must give consent to participate in the study')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await authAPI.register({
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        consentGiven: true,
        ageRange: form.ageRange,
        studyLevel: form.studyLevel,
        fieldOfStudy: form.fieldOfStudy,
        weeklyStudyHours: form.weeklyStudyHours ? parseInt(form.weeklyStudyHours) : undefined
      })
      setUserFromRegister(res.data.user, res.data.token)
      navigate('/onboarding/survey')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="card">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(step / 3) * 100}%` }} />
        </div>

        <h1>Join the Study</h1>
        <p className="text-muted">Step {step} of 3</p>

        {error && <div className="error">{error}</div>}

        {step === 1 && (
          <>
            <h2>Create your account</h2>
            <div className="form-group">
              <label>Full name *</label>
              <input value={form.fullName} onChange={e => update('fullName', e.target.value)} placeholder="Your full name" />
            </div>
            <div className="form-group">
              <label>Email address *</label>
              <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@university.edu" />
            </div>
            <div className="form-group">
              <label>Password *</label>
              <input type="password" value={form.password} onChange={e => update('password', e.target.value)} placeholder="Minimum 8 characters" />
            </div>
            <div className="form-group">
              <label>Confirm password *</label>
              <input type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} placeholder="Repeat your password" />
            </div>
            <button className="btn btn-primary" onClick={handleStep1}>Continue</button>
          </>
        )}

        {step === 2 && (
          <>
            <h2>About you</h2>
            <p>This information helps us understand your learning context. It is stored anonymously.</p>
            <div className="form-group">
              <label>Age range *</label>
              <select value={form.ageRange} onChange={e => update('ageRange', e.target.value)}>
                <option value="">Select age range</option>
                <option value="18-21">18 – 21</option>
                <option value="22-25">22 – 25</option>
                <option value="26-30">26 – 30</option>
                <option value="31+">31 and above</option>
              </select>
            </div>
            <div className="form-group">
              <label>Study level *</label>
              <select value={form.studyLevel} onChange={e => update('studyLevel', e.target.value)}>
                <option value="">Select study level</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="PhD">PhD</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Field of study *</label>
              <input value={form.fieldOfStudy} onChange={e => update('fieldOfStudy', e.target.value)} placeholder="e.g. Computer Science, Business" />
            </div>
            <div className="form-group">
              <label>How many hours per week do you typically study?</label>
              <input type="number" value={form.weeklyStudyHours} onChange={e => update('weeklyStudyHours', e.target.value)} placeholder="e.g. 10" min="0" max="80" />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
              <button className="btn btn-primary" onClick={handleStep2}>Continue</button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2>Research consent</h2>
            <div className="consent-box">
              <strong>What this study involves:</strong><br /><br />
              You are being invited to participate in a research study on learning behavior and decision-making patterns. During the study, the platform will record how you interact with learning content — including session times, content engagement, quiz attempts, and path selection choices.<br /><br />
              <strong>How your data will be used:</strong><br />
              All behavioral data is stored securely and anonymized before analysis. Your name and email will never appear in any research output. Data is used solely for academic research purposes.<br /><br />
              <strong>Your rights:</strong><br />
              Participation is entirely voluntary. You may withdraw at any time without consequence by deleting your account. You may request deletion of your data at any time.
            </div>
            <div className="checkbox-row">
              <input
                type="checkbox"
                id="consent"
                checked={form.consentGiven}
                onChange={e => update('consentGiven', e.target.checked)}
              />
              <label htmlFor="consent" style={{ marginBottom: 0, cursor: 'pointer' }}>
                I have read and understood the above. I voluntarily agree to participate in this study and consent to the collection of my behavioral interaction data.
              </label>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-secondary" onClick={() => setStep(2)}>Back</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || !form.consentGiven}>
                {loading ? 'Creating account...' : 'I agree — create my account'}
              </button>
            </div>
          </>
        )}

        <hr className="divider" />
        <p className="text-center text-muted">
          Already registered? <Link to="/login" className="link">Sign in</Link>
        </p>
      </div>
    </div>
  )
}