"use client";

import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { useRouter } from "next/navigation";
import { MapHoverCard } from "./MapHoverCard"; 

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export interface NodePoint {
  id: string;
  lat: number;
  lng: number;
  topicId?: string;
  country?: string | null;
  title?: string;
}

export function GlobeMap({ nodes }: { nodes: NodePoint[] }) {
  const router = useRouter();
  const [tooltip, setTooltip] = useState<{ x: number; y: number; node: NodePoint } | null>(null);

  return (
    <div className="relative h-full w-full overflow-hidden" onMouseLeave={() => setTooltip(null)}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 120 }}
        className="h-full w-full outline-none"
      >
        {/* ZoomableGroup enables scroll-to-zoom and click-and-drag panning */}
        <ZoomableGroup 
          center={[0, 30]} 
          zoom={1} 
          minZoom={1} 
          maxZoom={10}
          filterZoomEvent={(evt) => {
            // Optional: Only zoom if the user is holding Ctrl/Cmd to prevent accidental scrolling on the page
            return true; 
          }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#0a1930"
                  stroke="#1e3a8a"
                  strokeWidth={0.5}
                  className="outline-none"
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#0f274a", outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {nodes.map((node) => (
            <Marker 
              key={node.id} 
              coordinates={[node.lng, node.lat]}
              onMouseEnter={(e) => setTooltip({ x: e.clientX, y: e.clientY, node })}
              onMouseMove={(e) => setTooltip({ x: e.clientX, y: e.clientY, node })}
              onMouseLeave={() => setTooltip(null)}
              onClick={() => node.topicId && router.push(`/debate/${node.topicId}`)}
              className="cursor-pointer outline-none"
            >
              <circle r={10} fill="#22d3ee" className="animate-ping opacity-40" />
              <circle r={3} fill="#22d3ee" className="shadow-[0_0_15px_rgba(34,211,238,1)]" />
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {tooltip && <MapHoverCard x={tooltip.x} y={tooltip.y} node={tooltip.node} />}
    </div>
  );
}
