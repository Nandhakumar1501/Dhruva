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
          <p className="text-[11px] text-slate-400">
            Fleet-level trends for fuel usage, delta-v, collisions avoided, and current conjunction distribution.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 flex-1 min-h-0">
          <div className="border border-slate-800 bg-slate-950 p-3 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold text-slate-200">Delta-v vs Collisions Avoided (history)</div>
              <div className="flex gap-2 text-[9px] text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-0.5 bg-cyan-400 inline-block" /> Δv
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-0.5 bg-emerald-400 inline-block" /> Avoided
                </span>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <svg viewBox="0 0 360 120" className="w-full h-full">
                {points.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="2"
                    points={points
                      .map((p, i) => `${(i / (points.length - 1)) * 340 + 10},${100 - (p.totalDeltaVMps / maxDeltaV) * 80}`)
                      .join(" ")}
                  />
                )}
                {points.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2"
                    points={points
                      .map((p, i) => `${(i / (points.length - 1)) * 340 + 10},${100 - (p.collisionsAvoided / maxAvoided) * 80}`)
                      .join(" ")}
                  />
                )}
              </svg>
            </div>
          </div>

          <div className="border border-slate-800 bg-slate-950 p-3 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold text-slate-200">Current Conjunctions (CDMs)</div>
              <div className="text-[10px] text-slate-400">
                Total: {conjunctions.length} • Critical:{" "}
                {conjunctions.filter((c) => c.risk_level === "CRITICAL").length} • Warning:{" "}
                {conjunctions.filter((c) => c.risk_level === "WARNING").length}
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-auto">
              {conjunctions.length === 0 ? (
                <div className="text-xs text-slate-500">No active conjunctions.</div>
              ) : (
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-800">
