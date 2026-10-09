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
