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

  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 0.5;
  for (let a = 0; a < 360; a += 30) {
    const rad = (a * Math.PI) / 180;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(rad) * maxR, cy + Math.sin(rad) * maxR);
    ctx.stroke();
  }

  ctx.fillStyle = "#f8fafc";
  ctx.beginPath();
  ctx.arc(cx, cy, Math.max(4, w * 0.008), 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#94a3b8";
  ctx.font = `${Math.max(9, w * 0.018)}px sans-serif`;
  ctx.fillText(selectedSatelliteId ?? "SAT", cx + 7, cy + 3);

  const zones: typeof hitZonesRef.current = [];

  for (const c of filtered) {
    const norm = Math.min(1, c.tca_seconds / (24 * 3600));
    const r = Math.max(12, norm * maxR);
    const a = (c.relative_angle_deg * Math.PI) / 180;
    const px = cx + Math.cos(a) * r;
    const py = cy + Math.sin(a) * r;

    const dotR = c.risk_level === "CRITICAL" ? 6 : c.risk_level === "WARNING" ? 5 : 3.5;

    ctx.fillStyle = riskColor(c.risk_level);
    ctx.beginPath();
    ctx.arc(px, py, dotR, 0, Math.PI * 2);
    ctx.fill();

    if (c.risk_level !== "SAFE") {
      ctx.strokeStyle = riskColor(c.risk_level);
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(px, py, dotR + 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    ctx.fillStyle = "#cbd5e1";
    ctx.font = `${Math.max(8, w * 0.016)}px sans-serif`;
    ctx.fillText(c.debris_id, px + dotR + 4, py + 3);

    zones.push({ cx: px, cy: py, r: dotR + 8, item: c });
  }

  hitZonesRef.current = zones;
}

export default function BullseyePlot({ selectedSatelliteId, conjunctions }: BullseyeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const expandedCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tooltip, setTooltip] = useState<HitInfo | null>(null);
  const [expanded, setExpanded] = useState(false);
  const hitZonesRef = useRef<Array<{ cx: number; cy: number; r: number; item: ConjunctionItem }>>([]);
  const expandedHitZonesRef = useRef<Array<{ cx: number; cy: number; r: number; item: ConjunctionItem }>>([]);

  const filtered = useMemo(
    () => conjunctions.filter((c) => c.satellite_id === selectedSatelliteId).slice(0, 200),
    [conjunctions, selectedSatelliteId],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) drawBullseye(canvas, filtered, selectedSatelliteId, hitZonesRef);
  }, [filtered, selectedSatelliteId]);

  useEffect(() => {
    if (!expanded) return;
    const canvas = expandedCanvasRef.current;
    if (canvas) drawBullseye(canvas, filtered, selectedSatelliteId, expandedHitZonesRef);
  }, [filtered, selectedSatelliteId, expanded]);

  const handleCanvasClick = useCallback(
