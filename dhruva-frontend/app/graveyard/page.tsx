"use client";

import AppShell from "@/components/AppShell";
import { useSnapshotContext } from "@/components/SnapshotProvider";

export default function GraveyardPage() {
  const { snapshot } = useSnapshotContext();
  const satellites = snapshot?.satellites ?? [];

  const inGraveyard = satellites
    .filter((s) => s.in_graveyard_orbit || s.status === "GRAVEYARD")
    .sort((a, b) => {
      const at = a.graveyard_entry_time ? new Date(a.graveyard_entry_time).getTime() : Number.POSITIVE_INFINITY;
      const bt = b.graveyard_entry_time ? new Date(b.graveyard_entry_time).getTime() : Number.POSITIVE_INFINITY;
      return at - bt;
    });

  return (
    <AppShell>
      <div className="h-full flex flex-col gap-2">
