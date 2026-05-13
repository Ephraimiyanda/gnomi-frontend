import Link from 'next/link'
import { Globe, Radar, Users } from 'lucide-react'

interface Topic {
  id: string
  title: string
  description: string
  creatorId: string
  lat?: number
  lng?: number
  audienceCount?: number
}

const MOCK_COORDINATES: Array<Pick<Topic, 'lat' | 'lng'>> = [
  { lat: 40.7128, lng: -74.006 },
  { lat: 51.5072, lng: -0.1276 },
  { lat: 6.5244, lng: 3.3792 },
  { lat: 35.6762, lng: 139.6503 },
  { lat: -33.8688, lng: 151.2093 },
]

async function getTopics(): Promise<Topic[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  if (!baseUrl) return []

  const response = await fetch(`${baseUrl}/topics`, { cache: 'no-store' })
  if (!response.ok) return []

  const topics = (await response.json()) as Topic[]

  return topics.map((topic, index) => ({
    ...topic,
    lat: MOCK_COORDINATES[index % MOCK_COORDINATES.length]?.lat,
    lng: MOCK_COORDINATES[index % MOCK_COORDINATES.length]?.lng,
    audienceCount: 15 + index * 4,
  }))
}

function toMapPosition(lat: number, lng: number) {
  const x = ((lng + 180) / 360) * 100
  const y = ((90 - lat) / 180) * 100
  return { left: `${x}%`, top: `${y}%` }
}

export default async function LivePanelPage() {
  const topics = await getTopics()

const topics: TrendingTopic[] = [
  { id: 't1', name: 'AI Regulation', debates: 42, engagement: 91 },
  { id: 't2', name: 'Election Integrity', debates: 25, engagement: 84 },
  { id: 't3', name: 'Crypto Adoption', debates: 31, engagement: 88 },
  { id: 't4', name: 'Space Policy', debates: 17, engagement: 77 },
]

export default function HomePage() {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-cyan-900/30 bg-slate-900/60 p-6">
        <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-700/50 px-3 py-1 text-xs text-cyan-300">
          <Radar className="h-3.5 w-3.5" />
          Phase 2 • Live Globe Panel
        </p>
        <h1 className="text-2xl font-bold text-white">Interactive Global Debate Map</h1>
        <p className="mt-2 text-sm text-slate-400">
          Marker interactions are now in place for preview. Next step is replacing this with a 3D globe provider.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="relative min-h-[430px] overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.1),transparent_55%)]" />
            <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,rgba(148,163,184,.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,.2)_1px,transparent_1px)] [background-size:32px_32px]" />

            <div className="absolute left-1/2 top-1/2 h-[88%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-700/50 bg-slate-950/70 shadow-[0_0_80px_rgba(34,211,238,.2)_inset]">
              <div className="absolute inset-[6%] rounded-full border border-cyan-900/40" />
              {topics.map((topic) => {
                if (typeof topic.lat !== 'number' || typeof topic.lng !== 'number') return null
                const pos = toMapPosition(topic.lat, topic.lng)

                return (
                  <Link
                    key={topic.id}
                    href={`/debate/${topic.id}`}
                    className="group absolute -translate-x-1/2 -translate-y-1/2"
                    style={pos}
                  >
                    <span className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-cyan-400/25" />
                    <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-cyan-400 bg-slate-900 text-cyan-200 shadow-lg shadow-cyan-900/40 transition group-hover:scale-110">
                      <Globe className="h-4 w-4" />
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>

          <aside className="space-y-3">
            {topics.map((topic) => (
              <Link
                href={`/debate/${topic.id}`}
                key={topic.id}
                className="block rounded-xl border border-slate-800 bg-slate-900/80 p-4 transition hover:border-cyan-600/60 hover:bg-slate-900"
              >
                <h2 className="line-clamp-2 text-sm font-semibold text-white">{topic.title}</h2>
                <p className="mt-2 line-clamp-3 text-xs text-slate-400">{topic.description}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-cyan-300">
                  <span>Creator: {topic.creatorId}</span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> {topic.audienceCount ?? 0}
                  </span>
                </div>
              </Link>
            ))}

            {topics.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-700 p-5 text-sm text-slate-400">
                No live debates detected. Once topics exist, markers and cards will appear automatically.
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  )
}
