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
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function mag(v: number[]): number {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}

function julianDate(date: Date): number {
  let year = date.getUTCFullYear();
  let month = date.getUTCMonth() + 1;
  const day =
    date.getUTCDate() +
    (date.getUTCHours() + (date.getUTCMinutes() + (date.getUTCSeconds() + date.getUTCMilliseconds() / 1000) / 60) / 60) / 24;
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

function gmstRadians(timestamp: string): number {
  const jd = julianDate(new Date(timestamp));
  const t = (jd - 2451545.0) / 36525.0;
  const gmstDeg = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * t * t - (t * t * t) / 38710000.0;
  return ((gmstDeg % 360) * Math.PI) / 180;
}

function computeOrbitEllipseCesium(
  eci: { x: number; y: number; z: number; vx: number; vy: number; vz: number },
  timestamp: string,
  numPoints: number = 300,
): { x: number; y: number; z: number }[] {
  const r = [eci.x, eci.y, eci.z];
  const v = [eci.vx, eci.vy, eci.vz];
  const rMag = mag(r);
  const vSq = v[0] * v[0] + v[1] * v[1] + v[2] * v[2];

  const energy = vSq / 2 - MU / rMag;
  if (energy >= 0) return [];
  const a = -MU / (2 * energy);

  const h = cross(r, v);
  const hMag = mag(h);
  if (hMag < 1e-10) return [];

  const rdotv = r[0] * v[0] + r[1] * v[1] + r[2] * v[2];
  const eVec = [
    (vSq / MU - 1 / rMag) * r[0] - (rdotv / MU) * v[0],
    (vSq / MU - 1 / rMag) * r[1] - (rdotv / MU) * v[1],
    (vSq / MU - 1 / rMag) * r[2] - (rdotv / MU) * v[2],
  ];
  const e = mag(eVec);

  let P: number[];
  if (e > 1e-8) {
