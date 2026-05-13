import Link from 'next/link'
import { Users } from 'lucide-react'

export interface DebateRoom {
  id: string
  title: string
  participants: number
  country: string
  flag: string
  category: 'Politics' | 'Tech' | 'Ethics' | 'Sports'
}

export function DebateCard({ room }: { room: DebateRoom }) {
  return (
    <article className="group rounded-2xl border border-blue-500/20 bg-slate-900/75 p-5 shadow-lg shadow-slate-950 transition duration-300 hover:-translate-y-1.5 hover:border-blue-400/60 hover:shadow-blue-950/50">
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full border border-red-500/40 bg-red-500/15 px-2.5 py-1 text-xs font-medium text-red-200">LIVE</span>
        <span className="text-lg" aria-label={room.country}>{room.flag}</span>
      </div>
      <h3 className="text-base font-semibold text-white">{room.title}</h3>
      <p className="mt-3 inline-flex items-center gap-1 text-xs text-slate-300"><Users className="h-3.5 w-3.5" /> {room.participants} participants</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-xs text-blue-200">{room.category}</span>
        <Link href={`/debate/${room.id}`} className="rounded-lg bg-blue-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-400">Join</Link>
      </div>
    </article>
  )
}
