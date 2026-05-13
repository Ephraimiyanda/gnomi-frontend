import { create } from 'zustand'

export type DebateStatus = 'WAITING' | 'IN_PROGRESS' | 'VOTING' | 'FINISHED'

export interface DebateRound {
  id: string
  speakerId: string
  content: string
  roundNumber: number
}

export interface AiReport {
  winnerId: string
  reasoning: string
  fallaciesFound: string[]
}

interface DebateState {
  debateId: string | null
  status: DebateStatus
  rounds: DebateRound[]
  votesTally: Record<string, number>
  aiReport: AiReport | null
  setDebateState: (payload: Partial<Pick<DebateState, 'debateId' | 'status' | 'votesTally' | 'aiReport'>>) => void
  addRound: (round: DebateRound) => void
  reset: () => void
}

const initialState = {
  debateId: null,
  status: 'WAITING' as DebateStatus,
  rounds: [],
  votesTally: {},
  aiReport: null,
}

export const useDebateStore = create<DebateState>((set) => ({
  ...initialState,
  setDebateState: (payload) => set((state) => ({ ...state, ...payload })),
  addRound: (round) => set((state) => ({ rounds: [...state.rounds, round], status: 'IN_PROGRESS' })),
  reset: () => set(initialState),
}))
