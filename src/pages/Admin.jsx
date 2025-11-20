import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../components/AuthContext'

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

async function api(path, token) {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Forbidden')
  return res.json()
}

export default function Admin() {
  const { token, user } = useAuth()
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      try { setStats(await api('/admin/overview', token)) }
      catch (e) { setError('Access denied') }
    })()
  }, [token])

  return (
    <Layout>
      <div className="max-w-lg mx-auto bg-white border rounded p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Portal</h1>
        {error && <div className="text-rose-600">{error}</div>}
        {stats && (
          <ul className="space-y-2">
            <li>Total users: {stats.users}</li>
            <li>Nannies: {stats.nannies}</li>
            <li>Clients: {stats.clients}</li>
            <li>Bookings: {stats.bookings}</li>
            <li>Reviews: {stats.reviews}</li>
          </ul>
        )}
      </div>
    </Layout>
  )
}
