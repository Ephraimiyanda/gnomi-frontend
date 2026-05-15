'use client'

import { WorldMap } from 'react-svg-worldmap'

interface NodePoint {
  id: string
  lat: number
  lng: number
}

interface ReactMapGlMapProps {
  nodes: NodePoint[]
}

const countryCodePool = ['US', 'GB', 'NG', 'IN', 'DE', 'CA', 'BR', 'ZA', 'AU', 'JP']

export function ReactMapGlMap({ nodes }: ReactMapGlMapProps) {
  const data = nodes.map((node, index) => ({
    country: countryCodePool[index % countryCodePool.length],
    value: index + 1,
  }))

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-cyan-500/25 bg-[radial-gradient(circle_at_50%_20%,rgba(34,211,238,0.14),rgba(2,8,24,0.95)_55%)] p-2">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(to_right,rgba(56,189,248,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.08)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="relative z-10 h-full w-full rounded-xl border border-cyan-500/15 bg-[#020b1d]/70 p-2 shadow-[inset_0_0_40px_rgba(34,211,238,0.12)]">
        <WorldMap
          color="#22d3ee"
          valueSuffix=" active rooms"
          size="responsive"
          data={data}
          richInteraction
          styleFunction={(context) => {
            const base = {
              stroke: '#0f172a',
              strokeWidth: 0.8,
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.25s ease',
            }

            if (context.countryValue) {
              return {
                ...base,
                fill: context.countryValue > 0 ? '#0891b2' : '#0b1a33',
                fillOpacity: context.hover ? 1 : 0.82,
              }
            }

            return {
              ...base,
              fill: '#0a162b',
              fillOpacity: context.hover ? 0.92 : 0.68,
            }
          }}
        />
      </div>

      <div className="pointer-events-none absolute inset-x-6 bottom-6 grid grid-cols-3 gap-3 sm:grid-cols-5">
        {nodes.map((node) => (
          <span
            key={node.id}
            className="h-2.5 w-2.5 animate-ping rounded-full bg-cyan-300/80 shadow-[0_0_14px_rgba(34,211,238,0.95)]"
          />
        ))}
      </div>
    </div>
  )
}
