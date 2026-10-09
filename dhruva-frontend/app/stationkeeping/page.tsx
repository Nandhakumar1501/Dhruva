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
