'use client'

import { useEffect, useRef } from 'react'
import { io, type Socket } from 'socket.io-client'
import { useDebateStore } from '@/app/store/debateStore'

interface DebateSocketOptions {
  debateId: string
  enabled?: boolean
}

export function useDebateSocket({ debateId, enabled = false }: DebateSocketOptions) {
  const socketRef = useRef<Socket | null>(null)
  const { addRound, setDebateState, reset } = useDebateStore()

  useEffect(() => {
    if (!enabled || !debateId) return

    const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL ?? '', {
      transports: ['websocket'],
    })

    socketRef.current = socket

    setDebateState({ debateId, status: 'WAITING' })

    socket.on('connect', () => {
      socket.emit('joinRoom', { debateId })
    })

    socket.on('turnProcessed', (round) => {
      addRound(round)
    })

    socket.on('votingStarted', () => {
      setDebateState({ status: 'VOTING' })
    })

    socket.on('voteTallyUpdated', (votesTally) => {
      setDebateState({ votesTally })
    })

    socket.on('DEBATE_FINISHED', ({ winnerId, report }) => {
      setDebateState({
        status: 'FINISHED',
        aiReport: {
          winnerId,
          reasoning: report.reasoning,
          fallaciesFound: report.fallaciesFound ?? [],
        },
      })
    })

    socket.on('ERROR', (error) => {
      console.error('[Debate Socket ERROR]:', error.message)
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
      reset()
    }
  }, [addRound, debateId, enabled, reset, setDebateState])

  return socketRef
}
