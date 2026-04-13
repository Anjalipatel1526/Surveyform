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

        <Analytics />
        <SpeedInsights />
      </main>
    </BrowserRouter>
  )
}

export default App
