import Tabs from './components/Tabs'
import StudentForm from './components/StudentForm'
import SubjectForm from './components/SubjectForm'
import ScoreEntry from './components/ScoreEntry'
import ReportViewer from './components/ReportViewer'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-blue-100">
      <div className="relative min-h-screen p-6 md:p-10">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-white">Aplikasi Nilai Raport Otomatis</h1>
          <p className="text-blue-300 mt-2">Memudahkan guru memasukkan nilai tugas, kuis, UTS, UAS dan menghitung nilai akhir otomatis.</p>
        </header>

        <div className="max-w-6xl mx-auto">
          <Tabs
            tabs={{
              'Data Siswa': (
                <div className="space-y-4">
                  <StudentForm onCreated={() => {}} />
                  <StudentsList />
                </div>
              ),
              'Mapel & Bobot': <SubjectForm onCreated={() => {}} />,
              'Input Nilai': <ScoreEntry />,
              'Hitung Raport': <ReportViewer />,
            }}
          />
        </div>

        <footer className="text-center text-blue-300/70 text-sm mt-10">Made with Flames Blue</footer>
      </div>
    </div>
  )
}

function StudentsList() {
  const [list, setList] = useState([])
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  async function load() {
    const res = await fetch(`${baseUrl}/students`)
    const data = await res.json()
    setList(data)
  }

  useEffect(()=>{load()},[])

  return (
    <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
      <div className="text-white font-semibold mb-2">Daftar Siswa</div>
      <div className="grid md:grid-cols-2 gap-2 text-sm">
        {list.map(s => (
          <div key={s.id} className="bg-slate-900/40 rounded p-2">
            <div className="font-medium text-white">{s.full_name}</div>
            <div className="text-blue-300">{s.student_number} • {s.class_name}</div>
          </div>
        ))}
        {list.length === 0 && (<div className="text-blue-300">Belum ada data siswa.</div>)}
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
export default App
