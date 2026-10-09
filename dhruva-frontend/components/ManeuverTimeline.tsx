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
