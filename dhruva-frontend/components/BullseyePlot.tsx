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
