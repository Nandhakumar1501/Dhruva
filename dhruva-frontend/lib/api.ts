import { SnapshotPayload } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";
const WS_BASE = process.env.NEXT_PUBLIC_WS_BASE ?? "ws://localhost:8000";

export async function fetchSnapshot(): Promise<SnapshotPayload> {
  const res = await fetch(`${API_BASE}/api/visualization/snapshot`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Snapshot request failed: ${res.status}`);
  }
  return (await res.json()) as SnapshotPayload;
}

export async function setTimeWarp(multiplier: number): Promise<number> {
  const res = await fetch(`${API_BASE}/api/sim/timewarp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ multiplier }),
