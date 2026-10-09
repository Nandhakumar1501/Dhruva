"use client";

import AppShell from "@/components/AppShell";
import { useSnapshotContext } from "@/components/SnapshotProvider";

export default function AlertsPage() {
  const { snapshot } = useSnapshotContext();
  const conjunctions = snapshot?.conjunctions ?? [];

  return (
    <AppShell>
      <div className="h-full flex flex-col gap-2">
        <div className="border border-slate-800 bg-slate-950 p-3">
          <h2 className="text-sm font-semibold">CDM Alerts</h2>
          <p className="text-[11px] text-slate-400">Current conjunction warnings sorted by miss distance and time to closest approach.</p>
        </div>

        <div className="flex-1 min-h-0 border border-slate-800 bg-slate-950 overflow-auto p-3">
          {conjunctions.length === 0 ? (
            <div className="text-xs text-slate-500">No active conjunction alerts.</div>
