import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Navbar } from '@/app/components/layout/Navbar'
import { DebateCard, type DebateRoom } from '@/app/components/home/DebateCard'
import { MapSection } from '@/app/components/home/MapSection'
import { TopicCard, type TrendingTopic } from '@/app/components/home/TopicCard'

const markers = [
  { id: 'usa-room', label: 'USA', country: 'United States', left: '23%', top: '42%', rooms: 8, topic: 'AI in Education' },
  { id: 'uk-room', label: 'UK', country: 'United Kingdom', left: '48%', top: '34%', rooms: 5, topic: 'Democracy Reform' },
  { id: 'ng-room', label: 'Nigeria', country: 'Nigeria', left: '52%', top: '58%', rooms: 6, topic: 'Crypto Banking' },
  { id: 'ca-room', label: 'Canada', country: 'Canada', left: '20%', top: '28%', rooms: 3, topic: 'Climate Mandates' },
  { id: 'in-room', label: 'India', country: 'India', left: '69%', top: '49%', rooms: 7, topic: 'Space Priority' },
  { id: 'de-room', label: 'Germany', country: 'Germany', left: '52%', top: '36%', rooms: 4, topic: 'AI Governance' },
]

const rooms: DebateRoom[] = [
  { id: 'room-1', title: 'Should AI Replace Teachers?', participants: 124, country: 'USA', flag: '🇺🇸', category: 'Tech' },
  { id: 'room-2', title: 'Is Democracy Failing?', participants: 98, country: 'UK', flag: '🇬🇧', category: 'Politics' },
  { id: 'room-3', title: 'Crypto vs Traditional Banking', participants: 146, country: 'Nigeria', flag: '🇳🇬', category: 'Ethics' },
  { id: 'room-4', title: 'Should Space Exploration Be Prioritized?', participants: 87, country: 'India', flag: '🇮🇳', category: 'Sports' },
]

const topics: TrendingTopic[] = [
  { id: 't1', name: 'AI Regulation', debates: 42, engagement: 91 },
  { id: 't2', name: 'Election Integrity', debates: 25, engagement: 84 },
  { id: 't3', name: 'Crypto Adoption', debates: 31, engagement: 88 },
  { id: 't4', name: 'Space Policy', debates: 17, engagement: 77 },
]

export default function HomePage() {
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

      <MapSection markers={markers} />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Live Debate Rooms</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rooms.map((room) => <DebateCard key={room.id} room={room} />)}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Trending Topics</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {topics.map((topic) => <TopicCard key={topic.id} topic={topic} />)}
        </div>
      </section>
    </div>
  )
}
