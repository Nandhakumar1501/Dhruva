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
    const mag3 = Math.pow(rr[0] * rr[0] + rr[1] * rr[1] + rr[2] * rr[2], 1.5);
    const f = -MU / mag3;
    return [f * rr[0], f * rr[1], f * rr[2]];
  };
  const k1a = accel(r);
  const r2 = r.map((x, i) => x + v[i] * dt / 2);
  const v2 = v.map((x, i) => x + k1a[i] * dt / 2);
  const k2a = accel(r2);
  const r3 = r.map((x, i) => x + v2[i] * dt / 2);
  const v3 = v.map((x, i) => x + k2a[i] * dt / 2);
  const k3a = accel(r3);
  const r4 = r.map((x, i) => x + v3[i] * dt);
  const v4 = v.map((x, i) => x + k3a[i] * dt);
  const k4a = accel(r4);
  const newR = r.map((x, i) => x + (dt / 6) * (v[i] + 2 * v2[i] + 2 * v3[i] + v4[i]));
  const newV = v.map((x, i) => x + (dt / 6) * (k1a[i] + 2 * k2a[i] + 2 * k3a[i] + k4a[i]));
  return [newR, newV];
}

function computeForwardTrack(
  eci: { x: number; y: number; z: number; vx: number; vy: number; vz: number },
  timestamp: string,
  durationMinutes: number = 90,
  stepSeconds: number = 120,
): Array<{ lat: number; lon: number }> {
  let r = [eci.x, eci.y, eci.z];
  let v = [eci.vx, eci.vy, eci.vz];
  const gmst0 = gmstRad(timestamp);
  const pts: Array<{ lat: number; lon: number }> = [];
  const totalSteps = Math.floor((durationMinutes * 60) / stepSeconds);
  for (let i = 0; i <= totalSteps; i++) {
    const t = i * stepSeconds;
    const gmst = gmst0 + OMEGA_EARTH * t;
    const cosG = Math.cos(gmst);
    const sinG = Math.sin(gmst);
    const xe = r[0] * cosG + r[1] * sinG;
    const ye = -r[0] * sinG + r[1] * cosG;
    const ze = r[2];
    const rr = Math.sqrt(xe * xe + ye * ye + ze * ze);
    pts.push({
      lat: Math.asin(Math.max(-1, Math.min(1, ze / rr))) * 180 / Math.PI,
      lon: Math.atan2(ye, xe) * 180 / Math.PI,
    });
    if (i < totalSteps) [r, v] = propagateStep(r, v, stepSeconds);
  }
  return pts;
}

function mercatorXY(lat: number, lon: number, width: number, height: number) {
  const clampedLat = Math.max(-85, Math.min(85, lat));
  const x = ((lon + 180) / 360) * width;
  const latRad = (clampedLat * Math.PI) / 180;
  const mercY = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = height / 2 - (height * mercY) / (2 * Math.PI);
  return { x, y };
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpAngle(a: number, b: number, t: number): number {
  let diff = b - a;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return a + diff * t;
}

interface SatPos {
  lat: number;
  lon: number;
}

export default function GroundTrackMap({
  satellites,
  selectedSatelliteId,
  onSelectSatellite,
  timestamp,
  groundStations,
  debrisCloud,
