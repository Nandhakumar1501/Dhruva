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
