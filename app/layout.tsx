import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import { Navbar } from './components/layout/Navbar'
import { CreateTopicModal } from './components/home/CreateTopicModal'

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
      <body className="min-h-screen  text-slate-100 antialiased [background-image:radial-gradient(circle_at_1px_1px,rgba(148,163,184,.2)_1px,transparent_0)] [background-size:16px_16px]">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8 ">
          <Navbar />
          <main className="flex-1 ">{children}</main>
          <CreateTopicModal/>
        </div>
      </body>
    </html>
  )
}
