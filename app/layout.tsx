import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gnomi Debate Arena',
  description: 'Real-time global debate platform',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
          <header className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/80 px-6 py-4 backdrop-blur">
            <nav className="flex items-center justify-between">
              <Link href="/" className="text-lg font-semibold tracking-wide text-cyan-300">
                Gnomi • War Room
              </Link>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Link href="/" className="rounded-lg px-3 py-2 transition hover:bg-slate-800 hover:text-white">
                  Live Panel
                </Link>
                <Link href="/search" className="rounded-lg px-3 py-2 transition hover:bg-slate-800 hover:text-white">
                  Search Debates
                </Link>
              </div>
            </nav>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  )
}
