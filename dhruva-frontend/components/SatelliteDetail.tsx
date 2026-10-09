"use client";

import { SatelliteSnapshot } from "@/lib/types";

interface SatelliteDetailProps {
  satellite: SatelliteSnapshot | null;
}

const DRY_MASS_KG = 500.0;
const INITIAL_FUEL_KG = 50.0;

export default function SatelliteDetail({ satellite }: SatelliteDetailProps) {
  if (!satellite) {
    return (
      <div className="h-full border border-slate-800 bg-slate-950 p-3 flex items-center justify-center text-xs text-slate-500">
        Select a satellite to view details
      </div>
    );
  }

