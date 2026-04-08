import { useNavigate } from 'react-router-dom'

export default function ConsentPage() {
  const navigate = useNavigate()
  return (
    <div className="page">
      <div className="card">
        <h1>Consent</h1>
        <p>Consent is now part of the registration flow. Please register to begin.</p>
        <button className="btn btn-primary" onClick={() => navigate('/register')}>
          Go to registration
        </button>
      </div>
    </div>
  )
}