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

