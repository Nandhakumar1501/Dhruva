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
