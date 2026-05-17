"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import { Crown, Send, ShieldAlert, User, Activity } from "lucide-react";
import { useDebateSocket } from "@/app/hooks/useDebateSocket";
import { useDebateStore } from "@/app/store/debateStore";

export default function DebateWarRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // This hook connects to Socket.io and binds events to our Zustand store
  const socketRef = useDebateSocket({ debateId: id, enabled: true });

  const transcriptRef = useRef<HTMLDivElement | null>(null);

  // Local interface states
  const [speakerId, setSpeakerId] = useState<"user-1-id" | "user-2-id">(
    "user-1-id"
  );
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Global synchronized states
  const { rounds, status, votesTally, aiReport, debateId } = useDebateStore();

  // Auto-scroll transcript when a new round is added
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTo({
        top: transcriptRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [rounds]);

  const winnerLabel = useMemo(() => {
    if (!aiReport?.winnerId) return "TBD";
    return aiReport.winnerId === "user-1-id" ? "User 1" : "User 2";
  }, [aiReport?.winnerId]);

  // Functional Turn Submission
  const handleSubmitTurn = () => {
    if (!draft.trim() || !socketRef.current || isSending) return;

    setIsSending(true);

    // Emit to NestJS Backend
    socketRef.current.emit("submitTurn", {
      debateId: id,
      speakerId,
      content: draft.trim(),
      roundNum: rounds.length + 1, // Calculates the current round logically
    });

    // Reset local UI state
    setDraft("");
    setTimeout(() => setIsSending(false), 500); // Prevent double clicking
  };

  // Functional Voting Submission
  const handleVote = (votedForUserId: "user-1-id" | "user-2-id") => {
    if (!socketRef.current || !id) return;

    socketRef.current.emit("submitVote", {
      debateId: id,
      userId: `viewer-${Math.floor(Math.random() * 10000)}`, // Mocks unique viewers
      votedForUserId,
    });
  };

  return (
    <section className="grid h-[82vh] gap-4 lg:grid-cols-[2fr_1fr]">
      {/* TRANSCRIPT PANEL */}
      <article className="flex min-h-0 flex-col rounded-2xl border border-cyan-500/30 bg-[#060c1f] shadow-[0_0_80px_rgba(0,209,255,.05)]">
        <header className="flex items-center justify-between border-b border-cyan-500/20 px-5 py-4 bg-slate-900/50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-cyan-400" />
            <h1 className="text-sm font-bold tracking-widest text-cyan-300 uppercase">
              Live Transcript
            </h1>
          </div>
          <p className="text-[10px] font-mono text-slate-500">
            ROOM ID: {id.slice(0, 8)}
          </p>
        </header>

        <div
          ref={transcriptRef}
          className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5 scroll-smooth custom-scrollbar relative"
        >
          <div className="absolute inset-0 opacity-20 pointer-events-none [background-image:radial-gradient(circle_at_1px_1px,rgba(148,163,184,.2)_1px,transparent_0)] [background-size:16px_16px]" />

          {rounds.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-4 text-sm text-slate-400 relative z-10">
                Awaiting opening transmissions...
              </div>
            </div>
          ) : (
            rounds.map((round) => {
              const isUserOne = round.speakerId === "user-1-id";

              return (
                <div
                  key={round.id}
                  className={`relative z-10 max-w-[85%] rounded-xl p-4 text-[13px] leading-relaxed shadow-lg ${
                    isUserOne
                      ? "border border-cyan-700/50 bg-cyan-950/30 text-cyan-50 rounded-tl-sm"
                      : "ml-auto border border-violet-700/50 bg-violet-950/30 text-violet-50 rounded-tr-sm"
                  }`}
                >
                  <p
                    className={`mb-2 text-[10px] font-bold uppercase tracking-widest ${
                      isUserOne ? "text-cyan-400" : "text-violet-400"
                    }`}
                  >
                    {isUserOne ? "Participant 1" : "Participant 2"}{" "}
                    <span className="opacity-50 mx-1">•</span> Round{" "}
                    {round.roundNumber}
                  </p>
                  <p className="whitespace-pre-wrap break-words">
                    {round.content}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </article>

      {/* TACTICAL ACTION PANEL */}
      <aside className="flex flex-col min-h-0 rounded-2xl border border-cyan-500/30 bg-[#060c1f] p-5 shadow-[0_0_80px_rgba(0,209,255,.05)]">
        <div className="mb-6 border-b border-cyan-500/20 pb-4">
          <h2 className="text-sm font-bold tracking-widest text-white uppercase">
            Tactical Console
          </h2>
          <div className="mt-2 flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider">
            <span className="text-slate-500">SYS STATUS:</span>
            <span
              className={`px-2 py-0.5 rounded border font-bold ${
                status === "IN_PROGRESS"
                  ? "border-red-500/30 bg-red-500/10 text-red-400 animate-pulse"
                  : status === "VOTING"
                  ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
                  : status === "FINISHED"
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                  : "border-slate-700 bg-slate-800 text-slate-400"
              }`}
            >
              {status}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          {/* Phase 1: DEBATE IN PROGRESS */}
          {(status === "WAITING" || status === "IN_PROGRESS") && (
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                  Select Transmission Channel
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSpeakerId("user-1-id")}
                    className={`rounded-lg border px-3 py-2 text-xs font-bold transition ${
                      speakerId === "user-1-id"
                        ? "border-cyan-500 bg-cyan-500/20 text-cyan-300"
                        : "border-slate-700 bg-slate-900 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    USER 1 FREQ
                  </button>
                  <button
                    onClick={() => setSpeakerId("user-2-id")}
                    className={`rounded-lg border px-3 py-2 text-xs font-bold transition ${
                      speakerId === "user-2-id"
                        ? "border-violet-500 bg-violet-500/20 text-violet-300"
                        : "border-slate-700 bg-slate-900 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    USER 2 FREQ
                  </button>
                </div>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-1 transition-colors focus-within:border-cyan-500/50">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Input argument data..."
                  className="h-40 w-full resize-none bg-transparent p-3 text-sm text-slate-200 outline-none placeholder:text-slate-600"
                />
              </div>
              <button
                onClick={handleSubmitTurn}
                disabled={!draft.trim() || isSending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-bold tracking-widest text-slate-950 hover:bg-cyan-400 transition disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {isSending ? "TRANSMITTING..." : "TRANSMIT"}
              </button>
            </div>
          )}

          {/* Phase 2: AUDIENCE VOTING */}
          {status === "VOTING" && (
            <div className="space-y-4 rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-5">
              <p className="text-xs font-bold tracking-widest text-cyan-400 uppercase text-center mb-4">
                Audience Polling Active
              </p>
              <button
                onClick={() => handleVote("user-1-id")}
                className="group w-full flex items-center justify-between rounded-xl border border-cyan-700/60 bg-slate-900 px-4 py-4 hover:border-cyan-400 transition"
              >
                <span className="font-bold text-cyan-100 group-hover:text-cyan-400">
                  User 1
                </span>
                <span className="text-lg font-mono text-cyan-400">
                  {votesTally["user-1-id"] ?? 0}
                </span>
              </button>
              <button
                onClick={() => handleVote("user-2-id")}
                className="group w-full flex items-center justify-between rounded-xl border border-violet-700/60 bg-slate-900 px-4 py-4 hover:border-violet-400 transition"
              >
                <span className="font-bold text-violet-100 group-hover:text-violet-400">
                  User 2
                </span>
                <span className="text-lg font-mono text-violet-400">
                  {votesTally["user-2-id"] ?? 0}
                </span>
              </button>
            </div>
          )}

          {/* Phase 3: AI VERDICT */}
          {status === "FINISHED" && (
            <div className="space-y-5 rounded-2xl border border-amber-500/30 bg-[#120a00] p-5 shadow-[0_0_30px_rgba(245,158,11,.1)]">
              <div className="flex items-center gap-3 border-b border-amber-900/50 pb-3">
                <Crown className="h-5 w-5 text-amber-400" />
                <h3 className="font-bold tracking-widest text-amber-400 uppercase text-sm">
                  AI Verdict
                </h3>
              </div>

              <div className="bg-amber-950/30 rounded-lg p-4 border border-amber-900/30">
                <p className="text-[10px] uppercase font-bold tracking-widest text-amber-600 mb-1">
                  Declared Winner
                </p>
                <p className="text-lg font-bold text-amber-100">
                  {winnerLabel}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-amber-200/80">
                  {aiReport?.report?.reasoning ?? "Processing core logic..."}
                </p>
              </div>

              <div>
                <p className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-amber-500">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Logical Fallacies Detected
                </p>
                <div className="space-y-2">
                  {(aiReport?.report?.fallaciesFound?.length
                    ? aiReport.report.fallaciesFound
                    : []
                  ).map((f, i) => (
                    <div
                      key={i}
                      className="rounded border border-amber-900/40 bg-amber-950/20 p-3"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-amber-300">
                          {f.fallacy}
                        </span>
                        <span className="text-[9px] font-mono bg-amber-900/50 text-amber-200 px-1.5 rounded">
                          {f.speakerId === "user-1-id" ? "U1" : "U2"}
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-100/70">
                        {f.explanation}
                      </p>
                    </div>
                  ))}
                  {(!aiReport?.report?.fallaciesFound ||
                    aiReport.report.fallaciesFound.length === 0) && (
                    <p className="text-xs text-amber-500/60 italic px-2">
                      No critical fallacies logged.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </section>
  );
}
