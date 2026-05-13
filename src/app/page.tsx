import Link from 'next/link'
import { Globe, Plus, Radar } from 'lucide-react'

interface Topic {
  id: string
  title: string
  description: string
  creatorId: string
}

async function getTopics(): Promise<Topic[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  if (!baseUrl) return []

  const response = await fetch(`${baseUrl}/topics`, {
    method: 'GET',
    cache: 'no-store',
  })

  if (!response.ok) return []

  return response.json()
}

export default async function LobbyPage() {
  const topics = await getTopics()

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-cyan-900/40 bg-gradient-to-br from-slate-900 to-slate-950 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-700/40 px-3 py-1 text-xs text-cyan-300">
              <Radar className="h-3.5 w-3.5" />
              Global Live Panel (UI Preview)
            </p>
            <h1 className="text-2xl font-bold text-slate-100">Debates Orbiting the Globe</h1>
            <p className="mt-2 text-sm text-slate-400">
              Phase 1 preview: list + card interactions. 3D/round-earth map integration planned next.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-cyan-400">
            <Plus className="h-4 w-4" />
            Create Topic
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <Link
              href={`/debate/${topic.id}`}
              key={topic.id}
              className="group rounded-xl border border-slate-800 bg-slate-900/80 p-4 transition hover:-translate-y-0.5 hover:border-cyan-600/60 hover:bg-slate-900"
            >
              <div className="mb-3 flex items-center gap-2 text-cyan-300">
                <Globe className="h-4 w-4" />
                <span className="text-xs">Live Node</span>
              </div>
              <h2 className="line-clamp-2 text-base font-semibold text-white group-hover:text-cyan-200">{topic.title}</h2>
              <p className="mt-2 line-clamp-4 text-sm text-slate-400">{topic.description}</p>
            </Link>
          ))}

          {topics.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-700 p-6 text-sm text-slate-400">
              No topics yet. Connect backend and seed debates to populate the live panel.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
