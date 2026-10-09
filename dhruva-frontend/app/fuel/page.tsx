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
