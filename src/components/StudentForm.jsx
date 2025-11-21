import { useState } from 'react'

export default function StudentForm({ onCreated }) {
  const [form, setForm] = useState({ full_name: '', student_number: '', class_name: '', gender: '' })
  const [loading, setLoading] = useState(false)

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (res.ok) {
        onCreated && onCreated(data)
        setForm({ full_name: '', student_number: '', class_name: '', gender: '' })
      } else {
        alert(data.detail || 'Gagal menyimpan')
      }
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input className="input" placeholder="Nama lengkap" value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})} required />
        <input className="input" placeholder="NIS/NISN" value={form.student_number} onChange={e=>setForm({...form, student_number:e.target.value})} required />
        <input className="input" placeholder="Kelas (misal: IXA)" value={form.class_name} onChange={e=>setForm({...form, class_name:e.target.value})} required />
        <select className="input" value={form.gender} onChange={e=>setForm({...form, gender:e.target.value})}>
          <option value="">Jenis Kelamin</option>
          <option value="L">Laki-laki</option>
          <option value="P">Perempuan</option>
        </select>
      </div>
      <button disabled={loading} className="btn-primary">{loading ? 'Menyimpan...' : 'Tambah Siswa'}</button>
    </form>
  )
}
