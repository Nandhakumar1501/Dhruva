"use client";

import { BurnLogEntry } from "@/lib/types";

interface BurnLogsProps {
  logs: BurnLogEntry[];
}

export default function BurnLogs({ logs }: BurnLogsProps) {
  const executed = logs.filter((l) => l.executed);
  const rejected = logs.filter((l) => l.rejected);

  return (
    <div className="h-full border border-slate-800 bg-slate-950 flex flex-col">
      <div className="px-4 py-3 border-b border-slate-800">
        <div className="text-sm font-semibold text-slate-100">Burn Logs</div>
        <div className="text-[11px] text-slate-400">
          {executed.length} executed, {rejected.length} rejected
        </div>
      </div>
