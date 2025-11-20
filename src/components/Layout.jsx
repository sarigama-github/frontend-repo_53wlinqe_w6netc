import { useAuth } from './AuthContext'

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50">
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="font-bold text-emerald-700">Eco Nanny</a>
          <nav className="flex items-center gap-3">
            <a href="/" className="text-sm text-gray-600 hover:text-gray-900">Home</a>
            <a href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">Dashboard</a>
            <a href="/admin" className="text-sm text-gray-600 hover:text-gray-900">Admin</a>
            {user ? (
              <button onClick={logout} className="text-sm text-rose-600">Logout</button>
            ) : (
              <a href="/auth" className="text-sm text-emerald-700">Sign in</a>
            )}
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
