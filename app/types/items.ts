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
