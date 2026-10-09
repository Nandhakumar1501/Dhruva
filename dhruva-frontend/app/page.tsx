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
