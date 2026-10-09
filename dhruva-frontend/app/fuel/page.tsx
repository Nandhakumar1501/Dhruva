"use client";

import AppShell from "@/components/AppShell";
import { useSnapshotContext } from "@/components/SnapshotProvider";

const INITIAL_FUEL_KG = 50.0;

function fuelColor(pct: number) {
  if (pct > 40) return "bg-emerald-500";
  if (pct > 20) return "bg-amber-500";
  return "bg-red-500";
}

function fuelTextColor(pct: number) {
  if (pct > 40) return "text-emerald-400";
  if (pct > 20) return "text-amber-400";
  return "text-red-400";
}

export default function FuelPage() {
  const { snapshot, metricsHistory } = useSnapshotContext();
  const satellites = snapshot?.satellites ?? [];
  const metrics = snapshot?.metrics;

  const points = metricsHistory.slice(-80);
  const maxDeltaV = Math.max(1, ...points.map((p) => p.totalDeltaVMps));
  const maxAvoided = Math.max(1, ...points.map((p) => p.collisionsAvoided));

  const fleetFuelPct = metrics?.fleet_fuel_planned_pct ?? metrics?.fleet_fuel_pct ?? 0;
  const totalDeltaV = metrics?.total_delta_v_mps ?? 0;
  const collisionsAvoided = metrics?.collisions_avoided ?? 0;
  const avoidancePerDV = metrics?.avoidance_per_delta_v ?? 0;

  const sortedSats = [...satellites].sort((a, b) => {
    const pctA = ((a.planned_fuel_kg ?? a.fuel_kg) / INITIAL_FUEL_KG) * 100;
    const pctB = ((b.planned_fuel_kg ?? b.fuel_kg) / INITIAL_FUEL_KG) * 100;
    return pctA - pctB;
  });

  return (
    <AppShell>
      <div className="h-full flex flex-col gap-2 min-h-0">
        <div className="shrink-0 border border-slate-800 bg-slate-950 px-3 py-2">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-200">Fleet Fuel &amp; ∆v Analysis</h2>
          <p className="text-[10px] text-slate-500 mt-0.5">Per-satellite propellant budget · Fuel consumed vs collisions avoided</p>
        </div>

        <div className="grid grid-cols-4 gap-2 shrink-0">
          {[
            { label: "Fleet Fuel (planned)", value: `${fleetFuelPct.toFixed(1)}%`, color: "text-emerald-300" },
            { label: "Total ∆v (m/s)", value: totalDeltaV.toFixed(2), color: "text-cyan-300" },
            { label: "Collisions Avoided", value: String(collisionsAvoided), color: "text-violet-300" },
            { label: "Avoided per ∆v", value: avoidancePerDV.toFixed(4), color: "text-amber-300" },
          ].map(({ label, value, color }) => (
            <div key={label} className="border border-slate-800 bg-slate-950/80 p-2">
              <div className="text-[9px] text-slate-500 uppercase tracking-wide">{label}</div>
              <div className={`text-lg font-bold ${color}`}>{value}</div>
            </div>
          ))}
        </div>
