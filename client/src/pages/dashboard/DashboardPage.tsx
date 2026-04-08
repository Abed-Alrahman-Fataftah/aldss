import { useAuth } from '../../context/AuthContext'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome, {user?.fullName}</h1>
      <p>Group: {user?.group}</p>
      <p>Dashboard coming in Day 4.</p>
      <button onClick={logout} style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
        Log out
      </button>
    </div>
  )
}