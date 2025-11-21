import { useEffect, useState } from 'react'

export default function ScoreEntry() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [form, setForm] = useState({ student_id: '', subject_id: '', type: 'tugas', value: 0, note: '' })
  const [loading, setLoading] = useState(false)
  const [scores, setScores] = useState([])

  const load = async () => {
    const [s1, s2] = await Promise.all([
      fetch(`${baseUrl}/students`).then(r=>r.json()),
      fetch(`${baseUrl}/subjects`).then(r=>r.json())
    ])
    setStudents(s1)
    setSubjects(s2)
  }
  useEffect(()=>{load()},[])

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/scores`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Gagal simpan nilai')
      await refreshScores()
      setForm({...form, value:0, note:''})
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  const refreshScores = async () => {
    if (!form.student_id || !form.subject_id) return
    const res = await fetch(`${baseUrl}/scores?student_id=${form.student_id}&subject_id=${form.subject_id}`)
    const data = await res.json()
    setScores(data)
  }

  useEffect(()=>{refreshScores()}, [form.student_id, form.subject_id])

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
        <Select label="Siswa" value={form.student_id} onChange={v=>setForm({...form, student_id:v})} options={students.map(s=>({value:s.id, label:`${s.full_name} (${s.class_name})`}))} />
        <Select label="Mapel" value={form.subject_id} onChange={v=>setForm({...form, subject_id:v})} options={subjects.map(s=>({value:s.id, label:s.name}))} />
        <Select label="Tipe" value={form.type} onChange={v=>setForm({...form, type:v})} options={[{value:'tugas',label:'Tugas'},{value:'kuis',label:'Kuis'},{value:'uts',label:'UTS'},{value:'uas',label:'UAS'}]} />
        <NumberField label="Nilai" value={form.value} onChange={v=>setForm({...form, value:v})} />
        <input className="input" placeholder="Catatan (opsional)" value={form.note} onChange={e=>setForm({...form, note:e.target.value})} />
        <button className="btn-primary" disabled={loading || !form.student_id || !form.subject_id}>{loading ? 'Menyimpan...' : 'Tambah Nilai'}</button>
      </form>

      <div>
        <div className="text-sm text-blue-200 mb-2">Daftar nilai untuk kombinasi siswa & mapel terpilih:</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-blue-200">
                <th className="p-2">Tipe</th>
                <th className="p-2">Nilai</th>
                <th className="p-2">Catatan</th>
                <th className="p-2">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((sc, idx)=> (
                <tr key={idx} className="border-t border-blue-500/10">
                  <td className="p-2 capitalize">{sc.type}</td>
                  <td className="p-2">{sc.value}</td>
                  <td className="p-2">{sc.note || '-'}</td>
                  <td className="p-2">{sc.date ? new Date(sc.date).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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

function NumberField({ label, value, onChange }) {
  return (
    <label className="block">
      <div className="text-xs text-blue-200 mb-1">{label}</div>
      <input className="input" type="number" min="0" max="100" value={value} onChange={e=>onChange(Number(e.target.value))} />
    </label>
  )
}
