"use client";

import { BlackoutStatusItem } from "@/lib/types";

interface BlackoutPanelProps {
  blackoutStatus: BlackoutStatusItem[];
  selectedSatelliteId: string | null;
  onSelectSatellite: (id: string) => void;
}

function formatEta(seconds: number | null): string {
  if (seconds === null) return "--";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const mins = Math.floor(seconds / 60);
  const rem = Math.round(seconds % 60);
  return `${mins}m ${rem}s`;
}

export default function BlackoutPanel({
  blackoutStatus,
