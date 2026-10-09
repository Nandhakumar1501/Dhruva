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
    R: dot3(vec, r_hat),
    T: dot3(vec, t_hat),
    N: dot3(vec, n_hat),
  };
}

// Arrow helper for SVG
function Arrow({
  x1, y1, x2, y2, color, label, dashed,
}: {
  x1: number; y1: number; x2: number; y2: number;
  color: string; label?: string; dashed?: boolean;
}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 2) return null;
  const ux = dx / len;
  const uy = dy / len;
  const hx = x2 - ux * 8;
  const hy = y2 - uy * 8;
  const px = -uy;
  const py = ux;
  return (
    <g>
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color} strokeWidth={1.5}
        strokeDasharray={dashed ? "4,3" : undefined}
        opacity={0.85}
      />
      <polygon
        points={`${x2},${y2} ${hx + px * 4},${hy + py * 4} ${hx - px * 4},${hy - py * 4}`}
        fill={color} opacity={0.85}
      />
      {label && (
        <text x={x2 + ux * 6 + px * 8} y={y2 + uy * 6 + py * 8}
          fill={color} fontSize={9} textAnchor="middle">{label}</text>
      )}
    </g>
  );
}

export default function OrbitalRecoveryPlot({ satellite, evaBurn, recBurn }: Props) {
  const eci = satellite.eci;

  const rtn = useMemo(() => {
    if (!eci) return null;
    const r = { x: eci.x, y: eci.y, z: eci.z };
    const v = { x: eci.vx, y: eci.vy, z: eci.vz };
    const r_hat = norm3(r);
    const h = cross3(r, v);
    const n_hat = norm3(h);
    const t_cross = cross3(n_hat, r_hat);
    const t_hat = norm3(t_cross);
    return { r_hat, t_hat, n_hat };
  }, [eci]);

  // ── RTN panel constants ──────────────────────────────────────────────────
  const RTN_W = 260;
  const RTN_H = 260;
  const RTN_CX = RTN_W / 2;
  const RTN_CY = RTN_H / 2;
  const RTN_SCALE = 10; // px per km  (shows ±13 km)
  const BOX_KM = 10;
  const BOX_PX = BOX_KM * RTN_SCALE;

  // Nominal slot offset in RTN: mostly tangential (T), small radial (R)
  const altDelta = satellite.altitude_km - (satellite.nominal?.altitude_km ?? satellite.altitude_km);
  const tangentialDrift = Math.sqrt(Math.max(0, satellite.drift_km ** 2 - altDelta ** 2));
  const nomR = -altDelta;        // radial offset (positive = higher orbit)
  const nomT = -tangentialDrift; // tangential offset (behind in orbit)

  // Burn vectors projected to RT plane (magnified for visibility)
  const EVA_SCALE = 600; // km/s → km for display
  const evaRT = evaBurn && rtn
    ? toRTN(evaBurn.delta_v_kmps, rtn.r_hat, rtn.t_hat, rtn.n_hat)
    : null;
  const recRT = recBurn && rtn
    ? toRTN(recBurn.delta_v_kmps, rtn.r_hat, rtn.t_hat, rtn.n_hat)
