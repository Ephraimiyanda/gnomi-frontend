'use client'

import Link from 'next/link'
import { Filter, Search } from 'lucide-react'
import { useMemo, useState } from 'react'

type DebateStatus = 'WAITING' | 'IN_PROGRESS' | 'VOTING' | 'FINISHED'

interface SearchDebate {
  id: string
  title: string
  description: string
  region: string
  status: DebateStatus
}

const MOCK_DEBATES: SearchDebate[] = [
  {
    id: 'demo-1',
    title: 'Should AI-generated law drafts be allowed in public policy?',
    description: 'A policy-heavy debate about transparency and oversight constraints.',
    region: 'North America',
    status: 'IN_PROGRESS',
  },
  {
    id: 'demo-2',
    title: 'Is universal basic income sustainable at national scale?',
    description: 'Economic feasibility vs social safety net value arguments.',
    region: 'Europe',
    status: 'VOTING',
  },
  {
    id: 'demo-3',
    title: 'Should fossil fuel subsidies end by 2030?',
    description: 'Climate urgency versus energy transition practicality.',
    region: 'Africa',
    status: 'WAITING',
  },
]

export default function SearchDebatesPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'ALL' | DebateStatus>('ALL')
  const [region, setRegion] = useState<'ALL' | string>('ALL')

  const results = useMemo(() => {
    return MOCK_DEBATES.filter((debate) => {
      const queryMatch = debate.title.toLowerCase().includes(query.toLowerCase())
      const statusMatch = status === 'ALL' || debate.status === status
      const regionMatch = region === 'ALL' || debate.region === region
      return queryMatch && statusMatch && regionMatch
    })
  }, [query, region, status])

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h1 className="text-2xl font-bold text-white">Search Debates</h1>
        <p className="mt-2 text-sm text-slate-400">Phase 2 filter UX preview (wired to mock data for now).</p>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
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

          <label className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2">
            <span className="mb-2 inline-flex items-center gap-1 text-xs text-slate-400">
              <Filter className="h-3.5 w-3.5" /> Status
            </span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as 'ALL' | DebateStatus)}
              className="w-full bg-transparent text-sm text-slate-100 outline-none"
            >
              <option value="ALL">All statuses</option>
              <option value="WAITING">Waiting</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="VOTING">Voting</option>
              <option value="FINISHED">Finished</option>
            </select>
          </label>

          <label className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2">
            <span className="mb-2 inline-flex items-center gap-1 text-xs text-slate-400">Region</span>
            <select
              value={region}
              onChange={(event) => setRegion(event.target.value)}
              className="w-full bg-transparent text-sm text-slate-100 outline-none"
            >
              <option value="ALL">All regions</option>
              <option value="North America">North America</option>
              <option value="Europe">Europe</option>
              <option value="Africa">Africa</option>
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-3">
        {results.map((debate) => (
          <Link
            href={`/debate/${debate.id}`}
            key={debate.id}
            className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 transition hover:border-cyan-700/60"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">{debate.title}</h2>
              <span className="rounded-full border border-slate-700 px-2 py-1 text-[10px] uppercase tracking-wide text-cyan-300">
                {debate.status}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-400">{debate.description}</p>
            <p className="mt-3 text-[11px] text-slate-500">{debate.region}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
