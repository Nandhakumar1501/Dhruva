"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ConjunctionItem, DebrisTuple, GroundStationSnapshot, SatelliteSnapshot, TrackPoint } from "@/lib/types";

interface GroundTrackMapProps {
  satellites: SatelliteSnapshot[];
  selectedSatelliteId: string | null;
  onSelectSatellite: (id: string) => void;
  timestamp: string;
  groundStations: GroundStationSnapshot[];
  debrisCloud: DebrisTuple[];
  conjunctions: ConjunctionItem[];
  tracks?: Record<string, TrackPoint[]>;
}

const MU = 398600.4418;
const OMEGA_EARTH = 7.2921150e-5;


function julianDate(date: Date): number {
  let year = date.getUTCFullYear();
  let month = date.getUTCMonth() + 1;
  const day = date.getUTCDate() + (date.getUTCHours() + (date.getUTCMinutes() + (date.getUTCSeconds() + date.getUTCMilliseconds() / 1000) / 60) / 60) / 24;
  if (month <= 2) { year -= 1; month += 12; }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

function gmstRad(ts: string): number {
  const jd = julianDate(new Date(ts));
  const t = (jd - 2451545.0) / 36525.0;
  const deg = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * t * t - (t * t * t) / 38710000.0;
  return ((deg % 360 + 360) % 360) * Math.PI / 180;
}

function propagateStep(r: number[], v: number[], dt: number): [number[], number[]] {
  const accel = (rr: number[]) => {
