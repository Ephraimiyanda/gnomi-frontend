'use client'

import Link from 'next/link'
import { Filter, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

interface Topic {
  id: string
  title: string
  description: string
  creatorId: string
}

export default function SearchDebatesPage() {
  const [query, setQuery] = useState('')
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL
        if (!baseUrl) {
          setTopics([])
          return
        }
        const response = await fetch(`${baseUrl}/topics`)
        if (!response.ok) {
          setTopics([])
          return
        }
        const data = (await response.json()) as Topic[]
        setTopics(data)
      } finally {
        setLoading(false)
      }
    }

    void fetchTopics()
  }, [])

  const results = useMemo(
    () => topics.filter((debate) => debate.title.toLowerCase().includes(query.toLowerCase())),
    [query, topics],
  )

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h1 className="text-2xl font-bold text-white">Search Debates</h1>
        <p className="mt-2 text-sm text-slate-400">Live data from server topics endpoint.</p>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <label className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2">
            <span className="mb-2 inline-flex items-center gap-1 text-xs text-slate-400">
              <Search className="h-3.5 w-3.5" /> Topic
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
              placeholder="Search by title"
            />
          </label>
          <div className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1"><Filter className="h-3.5 w-3.5" /> Results</span>
            <p className="mt-2 text-sm text-slate-200">{results.length} debates found</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        {loading && <p className="text-sm text-slate-400">Loading debates...</p>}
        {!loading && results.map((debate) => (
          <Link href={`/debate/${debate.id}`} key={debate.id} className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 transition hover:border-cyan-700/60">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">{debate.title}</h2>
              <span className="rounded-full border border-slate-700 px-2 py-1 text-[10px] uppercase tracking-wide text-cyan-300">LIVE</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">{debate.description}</p>
            <p className="mt-3 text-[11px] text-slate-500">Creator: {debate.creatorId}</p>
          </Link>
        ))}
        {!loading && results.length === 0 && <p className="text-sm text-slate-400">No debates matched your search.</p>}
      </div>
    </section>
  )
}
