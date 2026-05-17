import { Activity, MapPin } from "lucide-react";
import { NodePoint } from "./GlobeMap";

interface MapHoverCardProps {
  x: number;
  y: number;
  node: NodePoint;
}

export function MapHoverCard({ x, y, node }: MapHoverCardProps) {
  return (
    <div
      className="pointer-events-none fixed z-50 w-64 -translate-x-1/2 -translate-y-[115%] rounded-xl border border-cyan-500/40 bg-[#040a1b]/95 p-4 shadow-[0_0_40px_rgba(34,211,238,0.15)] backdrop-blur-md transition-opacity duration-150"
      style={{ top: y, left: x }}
    >
      {/* Card Header */}
      <div className="mb-3 flex items-center justify-between border-b border-cyan-500/20 pb-2">
        <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-cyan-400">
          <Activity className="h-3 w-3" />
          LIVE ZONE
        </div>
        <span className="flex h-2 w-2 animate-pulse rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
      </div>

      {/* Card Body */}
      <div className="mb-1 flex items-center gap-1.5 justify-normal">
        <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-white">
          {node.country || "Unknown Region"}
        </h3>
      </div>

      <p className="mt-2 border-l-2 border-cyan-500/30 pl-2 text-[11px] leading-relaxed text-slate-400 line-clamp-2">
        {node.title || "Classified debate topic..."}
      </p>

      {/* Card Footer */}
      <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-2 text-[9px] font-mono text-slate-500">
        <span>ID: {node.topicId?.slice(0, 8)}</span>
        <span className="text-cyan-500/70">CLICK TO ENTER</span>
      </div>
    </div>
  );
}
