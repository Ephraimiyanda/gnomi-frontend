import Link from 'next/link'

interface Marker {
  id: string
  label: string
  country: string
  left: string
  top: string
  rooms: number
  topic: string
}

export function MapSection({ markers }: { markers: Marker[] }) {
  return (
    <section id="global-map" className="rounded-2xl border border-blue-500/20 bg-slate-900/70 p-5 shadow-lg shadow-blue-950/25">
      <h2 className="text-xl font-semibold text-white">Interactive World Map</h2>
      <p className="mt-1 text-sm text-slate-400">Hover a country marker to inspect live debate momentum.</p>
      <div className="relative mt-5 h-[360px] overflow-hidden rounded-2xl border border-slate-700 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_20%_20%,#3b82f6_0,transparent_35%),radial-gradient(circle_at_80%_60%,#38bdf8_0,transparent_40%)]" />
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,rgba(148,163,184,.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,.2)_1px,transparent_1px)] [background-size:38px_38px]" />

        {markers.map((marker) => (
          <Link key={marker.id} href={`/debate/${marker.id}`} style={{ left: marker.left, top: marker.top }} className="group absolute -translate-x-1/2 -translate-y-1/2">
            <span className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-blue-400/30" />
            <span className="relative block h-4 w-4 rounded-full border border-blue-200 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,.7)]" />
            <div className="pointer-events-none absolute left-6 top-0 hidden w-52 rounded-xl border border-blue-500/30 bg-slate-900/95 p-3 text-xs text-slate-200 shadow-xl group-hover:block">
              <p className="font-semibold text-white">{marker.country}</p>
              <p>{marker.rooms} live rooms</p>
              <p className="text-blue-300">Trending: {marker.topic}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
