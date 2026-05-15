"use client";

import Link from "next/link";
import { Bell, Globe2, Grid2x2, Home, Radio, Trophy, UserCircle2, Users } from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Debate Rooms", icon: Users },
  { href: "/rankings", label: "Rankings", icon: Trophy },
  { href: "/#global-map", label: "Global Map", icon: Globe2 },
];

export function Navbar() {
  return (
    <header className="mb-4 flex items-center justify-between border border-cyan-500/20 p-3 rounded-xl  bg-gradient-to-b from-[#040a1b] to-[#030713]">
      <button className="rounded-lg border border-slate-700 bg-slate-900/70 p-2 text-slate-300">
        <Grid2x2 className="h-4 w-4" />
      </button>
      <h1 className="text-xl font-bold tracking-[0.2em] text-cyan-400">
        DEBATE ARENA
      </h1>
      <button className="rounded-lg border border-slate-700 bg-slate-900/70 p-2 text-slate-300">
        <Radio className="h-4 w-4" />
      </button>
    </header>
  );
}
