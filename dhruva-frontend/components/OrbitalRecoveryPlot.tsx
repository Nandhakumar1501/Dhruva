"use client";

/**
 * OrbitalRecoveryPlot
 *
 * Two-panel SVG visualizer for station-keeping and orbital recovery:
 *
 * Left  — RTN Frame View: satellite at center, 10 km station-keeping box,
 *         nominal slot offset, evasion and recovery burn vectors.
 *
 * Right — Orbital Ring View: cross-section of actual orbit vs nominal orbit,
 *         altitude delta, satellite and nominal slot markers.
 */

import { useMemo } from "react";
import { ManeuverItem, SatelliteSnapshot } from "@/lib/types";

const RE = 6371; // km

interface Props {
  satellite: SatelliteSnapshot;
  evaBurn: ManeuverItem | null;
  recBurn: ManeuverItem | null;
}

function mag3(v: { x: number; y: number; z: number }) {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

function cross3(
  a: { x: number; y: number; z: number },
  b: { x: number; y: number; z: number }
) {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

function dot3(
  a: { x: number; y: number; z: number },
  b: { x: number; y: number; z: number }
) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function norm3(v: { x: number; y: number; z: number }) {
  const m = mag3(v);
  return { x: v.x / m, y: v.y / m, z: v.z / m };
}

/** Project ECI vector onto satellite RTN basis → [R, T, N] in km */
function toRTN(
  vec: { x: number; y: number; z: number },
  r_hat: { x: number; y: number; z: number },
  t_hat: { x: number; y: number; z: number },
  n_hat: { x: number; y: number; z: number }
) {
  return {
