import { Link } from 'react-router-dom'
import Layout from './components/Layout'

function App() {
  return (
    <Layout>
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-4">Find trusted eco‑friendly nannies</h1>
          <p className="text-gray-700 mb-6">Connect families with verified nannies who care for kids and the planet. Book, chat and review in one place.</p>
          <div className="flex gap-3">
            <Link to="/auth?as=client" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md">I'm a Parent</Link>
            <Link to="/auth?as=nanny" className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md">I'm a Nanny</Link>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border">
          <ul className="space-y-3 text-gray-700">
            <li>• Google sign in with role selection</li>
            <li>• Profiles for parents and nannies</li>
            <li>• Bookings and real‑time chat</li>
            <li>• Star ratings and reviews</li>
            <li>• Admin portal (email‑gated)</li>
          </ul>
        </div>
      </section>
    </Layout>
  )
}

export default App
