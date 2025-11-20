import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../components/AuthContext'

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

async function api(path, method = 'GET', body, token) {
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

function Stars({ value }) {
  return (
    <div className="text-amber-500">{'★★★★★☆☆☆☆☆'.slice(5 - value, 10 - value)}</div>
  )
}

export default function Reviews() {
  const { token, user } = useAuth()
  const [nannyId, setNannyId] = useState('')
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ booking_id: '', rating: 5, comment: '' })

  const load = async () => {
    if (!nannyId) return setItems([])
    const data = await api(`/reviews/nanny/${nannyId}`)
    setItems(data)
  }

  useEffect(() => { load() }, [nannyId])

  const submit = async (e) => {
    e.preventDefault()
    await api('/reviews', 'POST', { ...form, nanny_id: nannyId }, token)
    setForm({ booking_id: '', rating: 5, comment: '' })
    await load()
  }

  return (
    <Layout>
      <div className="grid gap-6 max-w-2xl mx-auto">
        <div className="bg-white border rounded p-4">
          <h1 className="text-xl font-semibold mb-3">Nanny Reviews</h1>
          <input className="border rounded p-2 w-full" placeholder="Enter nanny user id" value={nannyId} onChange={(e)=>setNannyId(e.target.value)} />
          <div className="mt-3 space-y-3">
            {items.map(r => (
              <div key={r.id} className="border rounded p-3">
                <Stars value={r.rating} />
                <div className="text-sm text-gray-600">{new Date(r.created_at).toLocaleString()}</div>
                <div>{r.comment}</div>
              </div>
            ))}
          </div>
        </div>

        {user?.role === 'client' && (
          <form onSubmit={submit} className="bg-white border rounded p-4 grid gap-3">
            <h2 className="font-semibold">Write a Review</h2>
            <input className="border rounded p-2" placeholder="Completed booking id" value={form.booking_id} onChange={(e)=>setForm({...form, booking_id: e.target.value})} />
            <select className="border rounded p-2" value={form.rating} onChange={(e)=>setForm({...form, rating: Number(e.target.value)})}>
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} star{n>1?'s':''}</option>)}
            </select>
            <textarea className="border rounded p-2" placeholder="Share your experience" value={form.comment} onChange={(e)=>setForm({...form, comment: e.target.value})} />
            <button className="bg-amber-600 text-white rounded py-2">Submit Review</button>
          </form>
        )}
      </div>
    </Layout>
  )
}
