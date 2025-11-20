import { useAuth } from './AuthContext'

function loadGoogleScript() {
  return new Promise((resolve) => {
    if (window.google && window.google.accounts) return resolve()
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = resolve
    document.body.appendChild(script)
  })
}

export default function GoogleSignIn({ role = 'client' }) {
  const { login } = useAuth()
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  async function handleClick() {
    await loadGoogleScript()
    /* global google */
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        try {
          const res = await fetch(`${baseUrl}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_token: response.credential, role }),
          })
          if (!res.ok) throw new Error('Sign in failed')
          const data = await res.json()
          login(data)
        } catch (e) {
          alert(e.message)
        }
      },
    })
    window.google.accounts.id.prompt()
  }

  return (
    <button onClick={handleClick} className="w-full bg-white text-gray-800 border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-50">
      Continue with Google
    </button>
  )
}
