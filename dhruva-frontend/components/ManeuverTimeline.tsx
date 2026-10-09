"use client";

import { useMemo } from "react";
import { ManeuverItem } from "@/lib/types";

interface TimelineProps {
  maneuvers: ManeuverItem[];
  nowIso: string;
}

const COOLDOWN_S = 600;
const WINDOW_MS = 6 * 3600 * 1000;

function formatTime(d: Date): string {
  return d.toISOString().slice(11, 16);
}

export default function ManeuverTimeline({ maneuvers, nowIso }: TimelineProps) {
  const now = new Date(nowIso).getTime();
  const windowStart = now - WINDOW_MS * 0.2;
  const windowEnd = now + WINDOW_MS * 0.8;

  const sorted = useMemo(
    () =>
      [...maneuvers]
        .sort((a, b) => new Date(a.burn_time).getTime() - new Date(b.burn_time).getTime())
        .filter((m) => {
          const t = new Date(m.burn_time).getTime();
          return t >= windowStart && t <= windowEnd;
        })
        .slice(0, 24),
    [maneuvers, windowStart, windowEnd],
  );

  const pct = (t: number) => Math.max(0, Math.min(100, ((t - windowStart) / (windowEnd - windowStart)) * 100));
  const nowPct = pct(now);

  const ticks: Array<{ p: number; label: string }> = [];
  const step = 3600 * 1000;
  for (let t = Math.ceil(windowStart / step) * step; t <= windowEnd; t += step) {
    ticks.push({ p: pct(t), label: formatTime(new Date(t)) });
  }

  return (
    <div className="h-full border border-slate-800 bg-slate-950 p-2 flex flex-col gap-0.5 text-[10px]">
      <div className="flex items-center justify-between mb-0.5">
        <h3 className="text-xs font-semibold text-slate-200">Maneuver Timeline</h3>
        <div className="flex gap-3 text-[9px] text-slate-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 inline-block" /> Burn</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-500/50 inline-block" /> Cooldown</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 inline-block" /> Executed</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-500 inline-block" /> Rejected</span>
        </div>
      </div>

      <div className="flex">
        <div className="w-20 shrink-0" />
        <div className="flex-1 relative h-4 border-b border-slate-800">
          {ticks.map((t) => (
            <div key={t.label} className="absolute top-0 -translate-x-1/2" style={{ left: `${t.p}%` }}>
