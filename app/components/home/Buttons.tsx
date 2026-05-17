import { Plus } from "lucide-react";

export function CreateTopicModalButton() {
  return (
    <button className="absolute bottom-15 right-15 cursor-pointer rounded-xl bg-cyan-400 p-3 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,.7)] transition hover:scale-105">
      <Plus className="h-6 w-6" />
    </button>
  );
}
