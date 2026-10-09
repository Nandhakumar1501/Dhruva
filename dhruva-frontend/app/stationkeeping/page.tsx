"use client";

import AppShell from "@/components/AppShell";
import { useSnapshotContext } from "@/components/SnapshotProvider";

export default function StationKeepingPage() {
  const { snapshot } = useSnapshotContext();
  const satellites = snapshot?.satellites ?? [];
  const maneuvers = snapshot?.maneuvers ?? [];
  const metrics = snapshot?.metrics;

  const outOfBox = satellites.filter((s) => s.status === "OUT_OF_BOX");
  const nominal = satellites.filter((s) => s.status === "NOMINAL");
  const recoveryBurns = maneuvers.filter((m) => m.burn_id?.startsWith("AUTO-REC-"));

  return (
    <AppShell>
      <div className="h-full flex flex-col gap-2">

        {/* Header */}
        <div className="border border-slate-800 bg-slate-950 p-3">
          <h2 className="text-sm font-semibold">Station-Keeping & Orbital Recovery</h2>
          <p className="text-[11px] text-slate-400">
            Tracks satellite drift from nominal orbital slots. Recovery burns are automatically scheduled when drift exceeds 10 km.
          </p>
        </div>

        {/* Fleet Uptime Metrics */}
        <div className="grid grid-cols-4 gap-2">
          <div className="border border-slate-800 bg-slate-950 p-3">
            <div className="text-[10px] text-slate-500 mb-1">Fleet Uptime</div>
            <div className="text-xl font-mono font-bold text-emerald-400">
              {metrics ? metrics.uptime_pct.toFixed(1) : "—"}%
            </div>
          </div>
          <div className="border border-slate-800 bg-slate-950 p-3">
            <div className="text-[10px] text-slate-500 mb-1">Uptime Score</div>
            <div className="text-xl font-mono font-bold text-cyan-400">
              {metrics ? metrics.uptime_score.toFixed(1) : "—"}
            </div>
          </div>
          <div className="border border-slate-800 bg-slate-950 p-3">
            <div className="text-[10px] text-slate-500 mb-1">Nominal</div>
            <div className="text-xl font-mono font-bold text-emerald-300">{nominal.length}</div>
          </div>
          <div className="border border-slate-800 bg-slate-950 p-3">
            <div className="text-[10px] text-slate-500 mb-1">Out of Box</div>
            <div className={`text-xl font-mono font-bold ${outOfBox.length > 0 ? "text-amber-400" : "text-slate-500"}`}>
              {outOfBox.length}
            </div>
          </div>
        </div>

        {/* Satellite Drift Table */}
        <div className="flex-1 min-h-0 border border-slate-800 bg-slate-950 overflow-auto p-3">
          <div className="text-[10px] text-slate-500 mb-2 font-medium uppercase tracking-wider">
            Satellite Drift from Nominal Slot
          </div>
          <table className="w-full text-[10px]">
            <thead>
