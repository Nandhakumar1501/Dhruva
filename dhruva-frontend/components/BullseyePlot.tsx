"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ConjunctionItem } from "@/lib/types";

interface BullseyeProps {
  selectedSatelliteId: string | null;
  conjunctions: ConjunctionItem[];
}

interface HitInfo {
  x: number;
  y: number;
  item: ConjunctionItem;
}

function riskColor(level: string) {
  if (level === "CRITICAL") return "#ef4444";
  if (level === "WARNING") return "#f59e0b";
  return "#22c55e";
}

function riskTextClass(level: string) {
  if (level === "CRITICAL") return "text-red-400";
  if (level === "WARNING") return "text-amber-400";
  return "text-emerald-400";
}

function drawBullseye(
  canvas: HTMLCanvasElement,
  filtered: ConjunctionItem[],
  selectedSatelliteId: string | null,
  hitZonesRef: React.MutableRefObject<Array<{ cx: number; cy: number; r: number; item: ConjunctionItem }>>,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const maxR = Math.min(w, h) * 0.42;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 1;
  const rings = [0.25, 0.5, 0.75, 1];
  const ringLabels = ["6h", "12h", "18h", "24h"];
  rings.forEach((k, idx) => {
    ctx.beginPath();
    ctx.arc(cx, cy, maxR * k, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#475569";
    ctx.font = `${Math.max(9, w * 0.018)}px sans-serif`;
    ctx.fillText(ringLabels[idx], cx + maxR * k + 3, cy - 3);
  });
