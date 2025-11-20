import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
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

export default function Chat() {
  const { bookingId } = useParams()
  const { token, user } = useAuth()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const wsRef = useRef(null)

  useEffect(() => {
    (async () => {
      try {
        const data = await api(`/messages/${bookingId}`, 'GET', undefined, token)
        setMessages(data)
      } catch (e) {}
    })()
  }, [bookingId, token])

  useEffect(() => {
    const url = baseUrl.replace('http', 'ws') + `/ws/chat/${bookingId}`
    const ws = new WebSocket(url)
    ws.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data)
        if (msg.type === 'message') setMessages((prev) => [...prev, msg.data])
      } catch {}
    }
    wsRef.current = ws
    return () => ws.close()
  }, [bookingId])

  const send = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    await api(`/messages/${bookingId}`, 'POST', { text }, token)
    setText('')
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto bg-white border rounded p-4">
        <h1 className="text-xl font-semibold mb-3">Chat</h1>
        <div className="h-80 overflow-y-auto border rounded p-3 space-y-2">
          {messages.map((m) => (
            <div key={m.id} className={`max-w-[70%] p-2 rounded ${m.sender_id === user?.id ? 'bg-emerald-100 ml-auto' : 'bg-gray-100'}`}>
              {m.text}
            </div>
          ))}
        </div>
        <form onSubmit={send} className="mt-3 flex gap-2">
          <input className="flex-1 border rounded p-2" value={text} onChange={(e)=>setText(e.target.value)} placeholder="Type a message" />
          <button className="bg-emerald-600 text-white px-4 rounded">Send</button>
        </form>
      </div>
    </Layout>
  )
}
