"use client";

import AppShell from "@/components/AppShell";
import { useSnapshotContext } from "@/components/SnapshotProvider";

export default function AnalyticsPage() {
  const { metricsHistory, snapshot } = useSnapshotContext();
  const points = metricsHistory.slice(-80);
  const metrics = snapshot?.metrics;

  const maxDeltaV = Math.max(1, ...points.map((p) => p.totalDeltaVMps));
  const maxAvoided = Math.max(1, ...points.map((p) => p.collisionsAvoided));

  const conjunctions = snapshot?.conjunctions ?? [];

  return (
    <AppShell>
      <div className="h-full flex flex-col gap-2">
        <div className="border border-slate-800 bg-slate-950 p-3">
          <h2 className="text-sm font-semibold">Analytics</h2>
