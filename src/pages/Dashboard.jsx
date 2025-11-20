import { useEffect, useMemo, useState } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../components/AuthContext'

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

async function api(path, method = 'GET', body, token) {
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

function NannyProfile() {
  const { token } = useAuth()
  const [form, setForm] = useState({ bio: '', years_experience: '', hourly_rate: '', skills: '', availability: '', location: '' })
  const [profile, setProfile] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const data = await api('/profile/nanny/me', 'GET', undefined, token)
        if (data) setProfile(data)
      } catch {}
    })()
  }, [token])

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form, years_experience: form.years_experience? Number(form.years_experience): null, hourly_rate: form.hourly_rate? Number(form.hourly_rate): null, skills: form.skills? form.skills.split(',').map(s=>s.trim()).filter(Boolean): [] }
      const data = await api('/profile/nanny', 'POST', payload, token)
      setProfile(data)
    } finally { setSaving(false) }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">My Nanny Profile</h2>
      {profile && (
        <div className="p-3 bg-emerald-50 border rounded">Saved profile for {profile.location || 'your area'}</div>
      )}
      <form onSubmit={submit} className="grid md:grid-cols-2 gap-3 bg-white p-4 border rounded">
        <input className="border p-2 rounded" placeholder="Bio" value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} />
        <input className="border p-2 rounded" placeholder="Years experience" value={form.years_experience} onChange={e=>setForm({...form,years_experience:e.target.value})} />
        <input className="border p-2 rounded" placeholder="Hourly rate" value={form.hourly_rate} onChange={e=>setForm({...form,hourly_rate:e.target.value})} />
        <input className="border p-2 rounded" placeholder="Skills (comma separated)" value={form.skills} onChange={e=>setForm({...form,skills:e.target.value})} />
        <input className="border p-2 rounded" placeholder="Availability" value={form.availability} onChange={e=>setForm({...form,availability:e.target.value})} />
        <input className="border p-2 rounded" placeholder="Location" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} />
        <button disabled={saving} className="md:col-span-2 bg-emerald-600 text-white py-2 rounded">{saving? 'Saving...' : 'Save'}</button>
      </form>
    </div>
  )
}

function ClientProfile() {
  const { token } = useAuth()
  const [form, setForm] = useState({ child_name: '', child_age: '', notes: '', address: '', phone: '' })
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const data = await api('/profile/client/me', 'GET', undefined, token)
        if (data) setProfile(data)
      } catch {}
    })()
  }, [token])

  const submit = async (e) => {
    e.preventDefault()
    const payload = { ...form, child_age: form.child_age? Number(form.child_age) : null }
    const data = await api('/profile/client', 'POST', payload, token)
    setProfile(data)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">My Family Profile</h2>
      {profile && (
        <div className="p-3 bg-sky-50 border rounded">Saved profile for {profile.child_name || 'your kid'}</div>
      )}
      <form onSubmit={submit} className="grid md:grid-cols-2 gap-3 bg-white p-4 border rounded">
        <input className="border p-2 rounded" placeholder="Child name" value={form.child_name} onChange={e=>setForm({...form,child_name:e.target.value})} />
        <input className="border p-2 rounded" placeholder="Child age" value={form.child_age} onChange={e=>setForm({...form,child_age:e.target.value})} />
        <input className="border p-2 rounded md:col-span-2" placeholder="Notes" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} />
        <input className="border p-2 rounded" placeholder="Address" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} />
        <input className="border p-2 rounded" placeholder="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
        <button className="md:col-span-2 bg-sky-600 text-white py-2 rounded">Save</button>
      </form>
    </div>
  )
}

function Bookings() {
  const { token, user } = useAuth()
  const [items, setItems] = useState([])
  const [creating, setCreating] = useState(false)
  const [nannyId, setNannyId] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')

  const load = async () => {
    const data = await api('/bookings', 'GET', undefined, token)
    setItems(data)
  }

  useEffect(() => { load() }, [])

  const create = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      await api('/bookings', 'POST', { nanny_id: nannyId, start_time: new Date(start), end_time: new Date(end) }, token)
      setNannyId(''); setStart(''); setEnd(''); await load()
    } finally { setCreating(false) }
  }

  const changeStatus = async (id, status) => {
    await api(`/bookings/${id}`, 'PATCH', { status }, token)
    await load()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Bookings</h2>
      {user?.role === 'client' && (
        <form onSubmit={create} className="grid md:grid-cols-4 gap-3 bg-white p-4 border rounded">
          <input className="border p-2 rounded" placeholder="Nanny user id" value={nannyId} onChange={e=>setNannyId(e.target.value)} />
          <input type="datetime-local" className="border p-2 rounded" value={start} onChange={e=>setStart(e.target.value)} />
          <input type="datetime-local" className="border p-2 rounded" value={end} onChange={e=>setEnd(e.target.value)} />
          <button disabled={creating} className="bg-emerald-600 text-white rounded">{creating? 'Creating...' : 'Create'}</button>
        </form>
      )}
      <div className="grid gap-3">
        {items.map(b => (
          <div key={b.id} className="bg-white p-4 border rounded flex items-center justify-between">
            <div>
              <div className="font-medium">{new Date(b.start_time).toLocaleString()} → {new Date(b.end_time).toLocaleString()}</div>
              <div className="text-sm text-gray-600">status: {b.status}</div>
            </div>
            <div className="flex items-center gap-2">
              {user.role === 'nanny' && (
                <>
                  <button onClick={()=>changeStatus(b.id,'accepted')} className="px-2 py-1 bg-emerald-600 text-white rounded">Accept</button>
                  <button onClick={()=>changeStatus(b.id,'declined')} className="px-2 py-1 bg-rose-600 text-white rounded">Decline</button>
                </>
              )}
              {(user.role === 'client' || user.role === 'nanny') && (
                <a href={`/chat/${b.id}`} className="px-2 py-1 bg-sky-600 text-white rounded">Open chat</a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <Layout>
      <div className="grid gap-8">
        {user?.role === 'nanny' ? <NannyProfile /> : <ClientProfile />}
        <Bookings />
      </div>
    </Layout>
  )
}
