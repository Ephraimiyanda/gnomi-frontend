import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Navbar } from '@/app/components/layout/Navbar'
import { DebateCard, type DebateRoom } from '@/app/components/home/DebateCard'
import { MapSection } from '@/app/components/home/MapSection'
import { TopicCard, type TrendingTopic } from '@/app/components/home/TopicCard'

interface Topic {
  id: string
  title: string
  description: string
  creatorId: string
}

async function getTopics(): Promise<Topic[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  if (!baseUrl) return []

  const response = await fetch(`${baseUrl}/topics`, { cache: 'no-store' })
  if (!response.ok) return []

  return (await response.json()) as Topic[]
}

function seededNumber(seed: string, min: number, max: number) {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) hash = (hash << 5) - hash + seed.charCodeAt(i)
  return Math.abs(hash % (max - min + 1)) + min
}

function toMapPosition(seed: string) {
  const left = `${seededNumber(seed, 18, 82)}%`
  const top = `${seededNumber(`${seed}-lat`, 20, 75)}%`
  return { left, top }
}

function getCategory(title: string): DebateRoom['category'] {
  const lower = title.toLowerCase()
  if (lower.includes('tech') || lower.includes('ai')) return 'Tech'
  if (lower.includes('ethic')) return 'Ethics'
  if (lower.includes('sport')) return 'Sports'
  return 'Politics'
}

export default async function HomePage() {
  const topics = await getTopics()

  const mapMarkers = topics.map((topic) => ({
    id: topic.id,
    label: topic.title,
    country: 'Global Region',
    rooms: seededNumber(topic.id, 1, 9),
    topic: topic.title,
    ...toMapPosition(topic.id),
  }))

  const liveRooms: DebateRoom[] = topics.map((topic) => ({
    id: topic.id,
    title: topic.title,
    participants: seededNumber(topic.id, 20, 160),
    country: 'Global',
    flag: '🌍',
    category: getCategory(topic.title),
  }))

  const trendingTopics: TrendingTopic[] = topics.slice(0, 8).map((topic) => ({
    id: topic.id,
    name: topic.title,
    debates: seededNumber(topic.id, 1, 20),
    engagement: seededNumber(`${topic.id}-eng`, 60, 98),
  }))

  return (
    <div className="space-y-6 pb-8">
      <Navbar />

      <section className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-slate-900/70 px-6 py-16 text-center shadow-2xl shadow-blue-950/25">
        <div className="absolute inset-0 -z-10 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,#3b82f6_0,transparent_35%),radial-gradient(circle_at_80%_20%,#60a5fa_0,transparent_35%),radial-gradient(circle_at_50%_85%,#1d4ed8_0,transparent_40%)]" />
        <h1 className="text-3xl font-bold text-white md:text-5xl">Join Global Debates in Real Time</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-300 md:text-base">
          Watch high-stakes argument battles, vote on winning logic, and review AI Judge verdicts across the world.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/search" className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-3 font-medium text-white transition hover:bg-blue-400">Join Debate <ArrowRight className="h-4 w-4" /></Link>
          <Link href="/#global-map" className="rounded-xl border border-slate-600 px-5 py-3 font-medium text-slate-200 transition hover:border-blue-400 hover:text-blue-200">Explore Topics</Link>
        </div>
      </section>

      <MapSection markers={mapMarkers} />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Live Debate Rooms</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {liveRooms.map((room) => <DebateCard key={room.id} room={room} />)}
          {liveRooms.length === 0 && <p className="text-sm text-slate-400">No live rooms currently available.</p>}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Trending Topics</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {trendingTopics.map((topic) => <TopicCard key={topic.id} topic={topic} />)}
          {trendingTopics.length === 0 && <p className="text-sm text-slate-400">No trending topics yet.</p>}
        </div>
      </section>
    </div>
  )
}
