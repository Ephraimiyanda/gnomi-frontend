export interface TrendingTopic {
  id: string
  name: string
  debates: number
  engagement: number
}

export function TopicCard({ topic }: { topic: TrendingTopic }) {
  return (
    <article className="min-w-64 rounded-2xl border border-blue-500/20 bg-slate-900/70 p-4">
      <h4 className="font-medium text-white">{topic.name}</h4>
      <p className="mt-2 text-xs text-slate-400">{topic.debates} active debates</p>
      <p className="text-xs text-blue-300">{topic.engagement}% engagement</p>
      <div className="mt-3 h-8 rounded bg-gradient-to-r from-blue-500/20 via-cyan-400/40 to-blue-500/20" />
    </article>
  )
}
