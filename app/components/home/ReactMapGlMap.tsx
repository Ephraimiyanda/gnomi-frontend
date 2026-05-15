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
    <div className="h-full w-full overflow-hidden rounded-2xl border border-cyan-500/20 bg-[#031126] p-2">
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
          }

          if (context.countryValue) {
            return {
              ...base,
              fill: context.countryValue > 0 ? '#0e7490' : '#0b1a33',
              fillOpacity: context.hover ? 1 : 0.85,
            }
          }

          return {
            ...base,
            fill: '#0b1a33',
            fillOpacity: context.hover ? 0.95 : 0.75,
          }
        }}
      />

      <div className="pointer-events-none absolute inset-x-8 bottom-8 grid grid-cols-3 gap-3 sm:grid-cols-5">
        {nodes.map((node) => (
          <span key={node.id} className="h-2 w-2 animate-ping rounded-full bg-cyan-300/70 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
        ))}
      </div>
    </div>
  )
}
