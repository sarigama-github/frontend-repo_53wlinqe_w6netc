import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import GoogleSignIn from '../components/GoogleSignIn'
import { useAuth } from '../components/AuthContext'

function useQuery() {
  const { search } = useLocation()
  return useMemo(() => new URLSearchParams(search), [search])
}

export default function Auth() {
  const q = useQuery()
  const role = q.get('as') === 'nanny' ? 'nanny' : 'client'
  const { user } = useAuth()
  const nav = useNavigate()

  useEffect(() => {
    if (user) nav('/dashboard')
  }, [user, nav])

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white rounded-xl border shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Eco Nanny</h1>
        <p className="text-gray-600 mb-6">Sign in with Google as a {role} to get started.</p>
        <GoogleSignIn role={role} />
      </div>
    </Layout>
  )
}
