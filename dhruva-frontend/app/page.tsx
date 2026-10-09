"use client";

import { useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import BullseyePlot from "@/components/BullseyePlot";
import ConstellationList from "@/components/ConstellationList";
import GroundTrackMap from "@/components/GroundTrackMap";
import OrbitTracker3D from "@/components/OrbitTracker3D";
import ManeuverTimeline from "@/components/ManeuverTimeline";
import SatelliteDetail from "@/components/SatelliteDetail";
import { useSnapshotContext } from "@/components/SnapshotProvider";
import TelemetryHeatmaps from "@/components/TelemetryHeatmaps";
import BlackoutPanel from "@/components/BlackoutPanel";

function Dashboard() {
  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");

  const {
    snapshot,
    selectedSatelliteId,
    setSelectedSatelliteId,
    metricsHistory,
    tracks,
  } = useSnapshotContext();

  const satellites = useMemo(() => snapshot?.satellites ?? [], [snapshot?.satellites]);
  const selectedSat = useMemo(
    () => satellites.find((s) => s.id === selectedSatelliteId) ?? null,
    [satellites, selectedSatelliteId],
  );

  return (
    <AppShell>
      <div className="flex flex-col gap-2 min-h-full">
        <div className="flex gap-2 flex-1 min-h-0 flex-col xl:flex-row">
          <div className="w-full xl:w-64 xl:shrink-0 flex flex-col gap-2 min-h-[22rem] xl:min-h-0">
            <div className="flex-1 min-h-0">
              <TelemetryHeatmaps satellites={satellites} metricsHistory={metricsHistory} />
            </div>
            <div className="flex-1 min-h-0">
