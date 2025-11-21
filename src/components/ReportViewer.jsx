import { useEffect, useState } from 'react'

export default function ReportViewer() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [studentId, setStudentId] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    Promise.all([
      fetch(`${baseUrl}/students`).then(r=>r.json()),
      fetch(`${baseUrl}/subjects`).then(r=>r.json())
    ]).then(([s1, s2]) => { setStudents(s1); setSubjects(s2) })
  },[])

  const generate = async () => {
    if (!studentId || !subjectId) return
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/report?student_id=${studentId}&subject_id=${subjectId}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Gagal menghitung raport')
      setReport(data)
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <Select label="Siswa" value={studentId} onChange={setStudentId} options={students.map(s=>({value:s.id, label:`${s.full_name} (${s.class_name})`}))} />
        <Select label="Mapel" value={subjectId} onChange={setSubjectId} options={subjects.map(s=>({value:s.id, label:s.name}))} />
        <button className="btn-primary" onClick={generate} disabled={!studentId || !subjectId || loading}>{loading ? 'Menghitung...' : 'Hitung Nilai Akhir'}</button>
        {report && (
          <a className="btn-secondary text-center" href="#" onClick={(e)=>{e.preventDefault(); window.print()}}>Cetak</a>
        )}
      </div>

      {report && (
        <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
          <div className="text-white text-lg font-semibold mb-2">Ringkasan</div>
          <div className="text-blue-200 text-sm mb-4">
            {report.student.full_name} • {report.student.class_name} • {report.subject.name}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {report.components.map((c,i)=> (
              <div key={i} className="bg-slate-900/40 rounded-lg p-3">
                <div className="text-xs text-blue-300">{c.type.toUpperCase()} ({c.weight}%)</div>
                <div className="text-white text-xl font-bold">{c.average !== null && c.average !== undefined ? c.average.toFixed(2) : '-'}</div>
                <div className="text-xs text-blue-300">Skor Tertimbang: {c.weighted_score.toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div className="text-white text-2xl font-bold">Nilai Akhir: {report.final_score.toFixed(2)}</div>
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${report.status === 'Tuntas' ? 'bg-green-600/30 text-green-300' : 'bg-red-600/30 text-red-300'}`}>{report.status}</div>
          </div>
        </div>
      )}
    </div>
  )
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <div className="text-xs text-blue-200 mb-1">{label}</div>
      <select className="input" value={value} onChange={e=>onChange(e.target.value)}>
        <option value="">Pilih</option>
        {options.map((o,i)=>(<option key={i} value={o.value}>{o.label}</option>))}
      </select>
    </label>
  )
}
