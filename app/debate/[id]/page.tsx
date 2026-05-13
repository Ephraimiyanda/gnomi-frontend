'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Crown, Send, ShieldAlert, User } from 'lucide-react'
import { useDebateSocket } from '@/app/hooks/useDebateSocket'
import { type DebateStatus, useDebateStore } from '@/app/store/debateStore'

export default function DebateWarRoomPage({ params }: { params: { id: string } }) {
  const { id } = params
  useDebateSocket({ debateId: id, enabled: false })

  const transcriptRef = useRef<HTMLDivElement | null>(null)
  const [speakerId, setSpeakerId] = useState<'user-1-id' | 'user-2-id'>('user-1-id')
  const [draft, setDraft] = useState('')

  const { rounds, status, votesTally, aiReport, setDebateState } = useDebateStore()

  useEffect(() => {
    transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: 'smooth' })
  }, [rounds])

  const winnerLabel = useMemo(() => {
    if (!aiReport?.winnerId) return 'TBD'
    return aiReport.winnerId === 'user-1-id' ? 'User 1' : 'User 2'
  }, [aiReport?.winnerId])

  const cycleStatus = () => {
    const order: DebateStatus[] = ['IN_PROGRESS', 'VOTING', 'FINISHED']
    const next = order[(order.indexOf(status) + 1) % order.length]
    setDebateState({ status: next })
  }

  return (
    <section className="grid h-[78vh] gap-4 lg:grid-cols-[2fr_1fr]">
      <article className="flex min-h-0 flex-col rounded-2xl border border-slate-800 bg-slate-900/70">
        <header className="border-b border-slate-800 px-5 py-4">
          <h1 className="text-lg font-semibold text-cyan-300">Debate Transcript</h1>
          <p className="text-xs text-slate-400">Room: {id}</p>
        </header>
        <div ref={transcriptRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
          {rounds.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-700 p-6 text-sm text-slate-400">
              Transcript preview mode — socket flow intentionally disabled for now.
            </div>
          ) : (
            rounds.map((round) => {
              const isUserOne = round.speakerId === 'user-1-id'

              return (
                <div key={round.id} className={`max-w-[90%] rounded-xl p-4 text-sm leading-6 ${isUserOne ? 'border border-cyan-700/50 bg-cyan-900/20 text-cyan-100' : 'ml-auto border border-violet-700/50 bg-violet-900/20 text-violet-100'} ${status === 'IN_PROGRESS' ? 'animate-pulse' : ''}`}>
                  <p className="mb-2 text-xs uppercase tracking-wide opacity-75">
                    {isUserOne ? 'User 1' : 'User 2'} • Round {round.roundNumber}
                  </p>
                  <p className="whitespace-pre-wrap break-words">{round.content}</p>
                </div>
              )
            })
          )}
        </div>
      </article>

      <aside className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-white">Action Panel</h2>
          <button onClick={cycleStatus} className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:bg-slate-800">
            Cycle Preview State
          </button>
        </div>

        {status === 'IN_PROGRESS' && (
          <div className="space-y-3">
            <label className="text-xs text-slate-400">Speaker</label>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setSpeakerId('user-1-id')} className={`rounded-lg px-3 py-2 text-sm ${speakerId === 'user-1-id' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-200'}`}>
                User 1
              </button>
              <button onClick={() => setSpeakerId('user-2-id')} className={`rounded-lg px-3 py-2 text-sm ${speakerId === 'user-2-id' ? 'bg-violet-500 text-white' : 'bg-slate-800 text-slate-200'}`}>
                User 2
              </button>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-950 p-3">
              <textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Compose argument..." className="h-32 w-full resize-none bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500" />
            </div>
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-medium text-slate-950 hover:bg-cyan-400">
              <Send className="h-4 w-4" />
              Submit Turn
            </button>
          </div>
        )}

        {status === 'VOTING' && (
          <div className="space-y-3">
            <p className="text-sm text-slate-300">Vote for the stronger argument:</p>
            <button className="w-full rounded-xl border border-cyan-700/60 bg-cyan-900/20 px-4 py-4 text-left hover:border-cyan-500">
              <p className="font-medium text-cyan-200">Vote User 1</p>
              <p className="text-sm text-cyan-400">{votesTally['user-1-id'] ?? 0} votes</p>
            </button>
            <button className="w-full rounded-xl border border-violet-700/60 bg-violet-900/20 px-4 py-4 text-left hover:border-violet-500">
              <p className="font-medium text-violet-200">Vote User 2</p>
              <p className="text-sm text-violet-400">{votesTally['user-2-id'] ?? 0} votes</p>
            </button>
          </div>
        )}

        {status === 'FINISHED' && (
          <div className="space-y-3 rounded-2xl border border-amber-600/50 bg-amber-900/20 p-4">
            <h3 className="flex items-center gap-2 font-semibold text-amber-200">
              <Crown className="h-4 w-4" />
              AI Judge Verdict
            </h3>
            <p className="text-sm text-amber-100">Winner: {winnerLabel}</p>
            <p className="text-sm text-amber-100/90">{aiReport?.reasoning ?? 'Reasoning appears here once backend finishes scoring.'}</p>
            <div>
              <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-amber-300">
                <ShieldAlert className="h-4 w-4" />
                Fallacies Found
              </p>
              <ul className="space-y-1 text-sm text-amber-100/90">
                {(aiReport?.fallaciesFound ?? ['None yet']).map((fallacy) => (
                  <li key={fallacy} className="flex items-start gap-2">
                    <User className="mt-0.5 h-3.5 w-3.5" />
                    {fallacy}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </aside>
    </section>
  )
}
