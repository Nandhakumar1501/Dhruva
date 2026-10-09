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
