import { useState, useEffect } from 'react'

export default function SubjectForm({ onCreated }) {
  const [form, setForm] = useState({ name: '', kkm: 70 })
  const [weights, setWeights] = useState({ tugas: 30, kuis: 20, uts: 20, uas: 30 })
  const [className, setClassName] = useState('')
  const [loading, setLoading] = useState(false)
  const [subjects, setSubjects] = useState([])

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const loadSubjects = async () => {
    const res = await fetch(`${baseUrl}/subjects`)
    const data = await res.json()
    setSubjects(data)
  }
  useEffect(()=>{loadSubjects()},[])

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // create subject if needed
      let subjectId = null
      if (!subjects.find(s=>s.name.toLowerCase() === form.name.trim().toLowerCase())) {
        const resSub = await fetch(`${baseUrl}/subjects`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
        const subData = await resSub.json()
        if (!resSub.ok) throw new Error(subData.detail || 'Gagal simpan mapel')
        subjectId = subData.id
        onCreated && onCreated(subData)
      } else {
        subjectId = subjects.find(s=>s.name.toLowerCase()===form.name.trim().toLowerCase()).id
      }

      // set weights
      const resW = await fetch(`${baseUrl}/weights`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ subject_id: subjectId, class_name: className || null, ...weights }) })
      const wData = await resW.json()
      if (!resW.ok) throw new Error(wData.detail || 'Gagal set bobot')
      alert('Mapel & bobot tersimpan')
      setForm({ name:'', kkm:70 })
      setWeights({ tugas:30, kuis:20, uts:20, uas:30 })
      setClassName('')
      loadSubjects()
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input className="input" placeholder="Nama Mapel" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
        <input className="input" type="number" min="0" max="100" placeholder="KKM" value={form.kkm} onChange={e=>setForm({...form, kkm:Number(e.target.value)})} />
        <input className="input" placeholder="Kelas (opsional)" value={className} onChange={e=>setClassName(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <NumberField label="Tugas %" value={weights.tugas} onChange={v=>setWeights({...weights, tugas:v})} />
        <NumberField label="Kuis %" value={weights.kuis} onChange={v=>setWeights({...weights, kuis:v})} />
        <NumberField label="UTS %" value={weights.uts} onChange={v=>setWeights({...weights, uts:v})} />
        <NumberField label="UAS %" value={weights.uas} onChange={v=>setWeights({...weights, uas:v})} />
      </div>
      <button disabled={loading} className="btn-primary">{loading ? 'Menyimpan...' : 'Simpan Mapel & Bobot'}</button>
    </form>
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
