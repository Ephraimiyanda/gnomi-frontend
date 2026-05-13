'use client'

import Link from 'next/link'
import { Bell, Globe2, Home, Trophy, UserCircle2, Users } from 'lucide-react'

const links = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Debate Rooms', icon: Users },
  { href: '/rankings', label: 'Rankings', icon: Trophy },
  { href: '/#global-map', label: 'Global Map', icon: Globe2 },
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 rounded-2xl border border-blue-500/20 bg-slate-900/70 px-4 py-3 shadow-2xl shadow-blue-950/30 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400" />
          <span className="font-semibold tracking-wide text-white">Gnomi Arena</span>
        </div>
        <nav className="hidden items-center gap-2 md:flex">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-200 transition hover:bg-blue-500/15 hover:text-blue-200">
              <Icon className="h-4 w-4" /> {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button className="rounded-lg p-2 text-slate-200 transition hover:bg-blue-500/15 hover:text-blue-200"><Bell className="h-4 w-4" /></button>
          <button className="rounded-lg p-1 text-slate-200 transition hover:bg-blue-500/15 hover:text-blue-200"><UserCircle2 className="h-7 w-7" /></button>
        </div>
      </div>
    </header>
  )
}
