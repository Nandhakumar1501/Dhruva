"use client";

import { SatelliteSnapshot } from "@/lib/types";

interface TelemetryProps {
  satellites: SatelliteSnapshot[];
  metricsHistory: Array<{ timestamp: number; fleetFuelPct: number; totalDeltaVMps: number; collisionsAvoided: number }>;
}

export default function TelemetryHeatmaps({ satellites, metricsHistory }: TelemetryProps) {
  const latest = metricsHistory[metricsHistory.length - 1];
  const points = metricsHistory.slice(-40);
  const maxDeltaV = Math.max(1, ...points.map((p) => p.totalDeltaVMps));
  const maxAvoided = Math.max(1, ...points.map((p) => p.collisionsAvoided));

  return (
    <div className="h-full border border-slate-800 bg-slate-950 p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between shrink-0">
        <h3 className="text-xs font-semibold tracking-wide text-slate-200 uppercase">Telemetry</h3>
        <div className="flex gap-2 text-[9px] text-slate-500">
