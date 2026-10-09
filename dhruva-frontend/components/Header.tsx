"use client";

interface HeaderProps {
  status: "connecting" | "live" | "degraded" | "disconnected" | "error";
  timestamp: string | null;
  timeWarpX: number;
  onDecreaseTimeWarp: () => void;
  onIncreaseTimeWarp: () => void;
}

export default function Header({
  status,
  timestamp,
  timeWarpX,
  onDecreaseTimeWarp,
  onIncreaseTimeWarp,
}: HeaderProps) {
  const isLive = status === "live";
  const isDegraded = status === "degraded";
  const statusLabel = status.toUpperCase();
