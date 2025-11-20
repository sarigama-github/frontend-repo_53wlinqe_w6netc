import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Test from './Test'
import './index.css'
import { AuthProvider } from './components/AuthContext'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import Chat from './pages/Chat'
import Reviews from './pages/Reviews'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/chat/:bookingId" element={<Chat />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
)
