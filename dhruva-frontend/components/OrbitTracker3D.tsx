"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react";
import { BlackoutStatusItem, ConjunctionItem, DebrisTuple, SatelliteSnapshot } from "@/lib/types";

const MU = 398600.4418;

interface OrbitTracker3DProps {
  satellites: SatelliteSnapshot[];
  selectedSatelliteId: string | null;
  onSelectSatellite: (id: string) => void;
  timestamp: string;
  debrisCloud: DebrisTuple[];
  conjunctions: ConjunctionItem[];
  blackoutStatus: BlackoutStatusItem[];
}

function cross(a: number[], b: number[]): number[] {
  return [
