"use client";

import { SatelliteSnapshot } from "@/lib/types";

interface ConstellationListProps {
  satellites: SatelliteSnapshot[];
  selectedSatelliteId: string | null;
  onSelectSatellite: (id: string) => void;
}

export default function ConstellationList({
  satellites,
  selectedSatelliteId,
  onSelectSatellite,
}: ConstellationListProps) {
  return (
    <div className="h-full border border-slate-800 bg-slate-950 p-3 flex flex-col gap-2">
      <h3 className="text-sm font-semibold">Constellation Contents</h3>
      <div className="overflow-auto space-y-2 pr-1">
        {satellites.map((sat) => {
