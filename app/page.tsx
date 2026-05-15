import { Activity, Grid2x2, Plus, Radio } from 'lucide-react'
import { ThreeGlobeMap } from '@/app/components/home/ThreeGlobeMap'

interface TacticalRoom {
  id: string
  round: string
  title: string
  subtitle: string
  audience: string
}

const tacticalFeed: TacticalRoom[] = [
  {
    id: 'agi',
    round: 'ROUND 3/5',
    title: 'The Future of AGI',
    subtitle: 'Regulatory frameworks for intelligence containment.',
    audience: '1.2k',
  },
  {
    id: 'mars',
    round: 'ROUND 1/3',
    title: 'Mars Colonization',
    subtitle: 'The ethics of multi-planetary expansion.',
    audience: '850',
  },
  {
    id: 'quantum',
    round: 'ROUND 4/4',
    title: 'Quantum Supremacy',
    subtitle: 'Global security in the post-quantum era.',
    audience: '2.4k',
  },
]

const pulseNodes = [
  { id: 'n1', lat: 40.7128, lng: -74.006 },
  { id: 'n2', lat: 51.5072, lng: -0.1276 },
  { id: 'n3', lat: 6.5244, lng: 3.3792 },
  { id: 'n4', lat: 28.6139, lng: 77.209 },
  { id: 'n5', lat: 52.52, lng: 13.405 },
]

export default function HomePage() {
  return (
    <section className="relative min-h-[82vh] overflow-hidden rounded-2xl border border-cyan-500/30 bg-[#060c1f] p-4 shadow-[0_0_80px_rgba(0,209,255,.15)] md:p-6">
      <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,rgba(148,163,184,.2)_1px,transparent_0)] [background-size:16px_16px]" />
      <div className="relative z-10">
      
        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <div className="relative rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-[#040a1b] to-[#030713] p-4">
            <div className="max-w-sm rounded-xl border border-slate-700/80 bg-slate-900/60 px-3 py-2 text-xs text-slate-500">
              SEARCH TACTICAL FREQUENCIES...
            </div>

            <div className="mt-4 flex flex-wrap items-end gap-5 text-xs">
              <div>
                <p className="text-slate-500">OPERATIONAL RANK</p>
                <p className="font-semibold tracking-widest text-cyan-400">ELITE LVL 08</p>
              </div>
              <div>
                <p className="text-slate-500">CREDIBILITY RATING</p>
                <p className="font-semibold text-yellow-300">98.4%</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
              {['AGI', 'ECONOMICS', 'GEOPOLITICS', 'BIO-ETHICS', 'CYBERWAR'].map((tag) => (
                <span key={tag} className="rounded-full border border-cyan-500/30 bg-[#071531] px-3 py-1 text-slate-300">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs text-slate-300">
              <Activity className="h-3.5 w-3.5 text-cyan-400" /> ACTIVE ZONES: 42
            </div>

            <div className="relative mt-6 h-[460px] overflow-hidden rounded-2xl border border-cyan-500/10 bg-[#020818]">
              <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,.14),rgba(3,7,18,.05)_55%,transparent_70%)]" />
              <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_50%_20%,#0ea5e9_0,transparent_40%)]" />

              <ThreeGlobeMap nodes={pulseNodes} />
            </div>

            <button className="absolute bottom-5 right-5 rounded-xl bg-cyan-400 p-3 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,.7)] transition hover:scale-105">
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <aside className="rounded-2xl border border-cyan-500/30 bg-slate-900/65 p-3">
            <div className="mb-3 flex items-center gap-2 border-b border-slate-700 pb-2 text-sm font-semibold tracking-wide text-slate-200">
              <Radio className="h-4 w-4 text-cyan-400" /> TACTICAL FEED
            </div>

            <div className="space-y-3">
              {tacticalFeed.map((item) => (
                <article key={item.id} className="rounded-xl border border-slate-700 bg-slate-900/80 p-3">
                  <div className="mb-2 flex items-center justify-between text-[10px]">
                    <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-cyan-300">{item.round}</span>
                    <span className="text-yellow-300">👥 {item.audience}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-100">{item.title}</h3>
                  <p className="mt-1 text-xs text-slate-400">{item.subtitle}</p>
                </article>
              ))}
            </div>

            <button className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-950 py-2 text-xs font-semibold tracking-[0.16em] text-slate-300 transition hover:border-cyan-500 hover:text-cyan-300">
              ACCESS FULL DIRECTORY
            </button>
          </aside>
        </div>
      </div>
    </section>
  )
}
