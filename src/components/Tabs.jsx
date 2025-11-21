import { useState } from 'react'

export default function Tabs({ tabs }) {
  const [active, setActive] = useState(Object.keys(tabs)[0])

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {Object.keys(tabs).map(key => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${active === key ? 'bg-blue-600 text-white' : 'bg-slate-700/60 text-blue-200 hover:bg-slate-700'}`}
          >
            {key}
          </button>
        ))}
      </div>
      <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
        {tabs[active]}
      </div>
    </div>
  )
}
