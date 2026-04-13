import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import SurveyForm from './components/SurveyForm'
import AdminDashboard from './components/AdminDashboard'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

function App() {
  return (
    <BrowserRouter>
      <main className="antialiased font-inter">
        <Routes>
          <Route path="/" element={<SurveyForm />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>

        {/* Helper Navigation for development */}
        <div className="fixed bottom-4 right-4 flex gap-2 z-50">
          <Link
            to="/"
            className="text-[10px] text-slate-500 hover:text-slate-300 uppercase tracking-widest font-bold px-3 py-1 bg-slate-800/50 hover:bg-slate-800 rounded-full border border-slate-700 transition-all shadow-lg backdrop-blur-sm"
          >
            Survey
          </Link>
          <Link
            to="/admin"
            className="text-[10px] text-slate-500 hover:text-slate-300 uppercase tracking-widest font-bold px-3 py-1 bg-slate-800/50 hover:bg-slate-800 rounded-full border border-slate-700 transition-all shadow-lg backdrop-blur-sm"
          >
            Admin
          </Link>
        </div>

        <Analytics />
        <SpeedInsights />
      </main>
    </BrowserRouter>
  )
}

export default App
