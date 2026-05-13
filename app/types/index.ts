export type DebateStatus = "WAITING" | "IN_PROGRESS" | "VOTING" | "FINISHED";

export interface Round {
  id: string;
  speakerId: string;
  content: string;
  roundNumber: number;
}

export interface DebateState {
  debateId: string | null;
  status: DebateStatus;
  rounds: Round[];
  votesTally: Record<string, number>;
  aiReport: {
    winnerId: string;
    reasoning: string;
    fallaciesFound: string[];
  } | null;

  // Actions
  setDebateState: (status: DebateStatus) => void;
  addRound: (round: Round) => void;
  updateVotes: (tally: Record<string, number>) => void;
  setAiReport: (report: any) => void;
  reset: () => void;
}
