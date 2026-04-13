import React, { useState } from 'react'
import SurveyForm from './components/SurveyForm'
import AdminDashboard from './components/AdminDashboard'

function App() {
  const [view, setView] = useState('survey') // 'survey' or 'admin'

  return (
    <main className="antialiased font-inter">
      {view === 'survey' ? (
        <>
          <SurveyForm />
          {/* Simple toggle for demo purposes */}
          <button
            onClick={() => setView('admin')}
            className="fixed bottom-4 right-4 text-[10px] text-slate-500/50 hover:text-slate-400 uppercase tracking-widest font-bold px-3 py-1 bg-white/5 rounded-full border border-white/5 hover:bg-white/10 transition-all z-50"
          >
            Go to Admin
          </button>
        </>
      ) : (
        <>
          <AdminDashboard />
          <button
            onClick={() => setView('survey')}
            className="fixed bottom-4 right-4 text-[10px] text-slate-500 hover:text-slate-300 uppercase tracking-widest font-bold px-3 py-1 bg-slate-800 rounded-full border border-slate-700 transition-all z-50 shadow-lg"
          >
            Back to Survey
          </button>
        </>
      )}
    </main>
  )
}

export default App
