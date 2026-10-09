"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { createOrbitSocket, fetchSnapshot, setTimeWarp } from "@/lib/api";
import { SnapshotPayload, TrackPoint } from "@/lib/types";

interface SnapshotContextType {
  snapshot: SnapshotPayload | null;
  status: "connecting" | "live" | "degraded" | "disconnected" | "error";
  selectedSatelliteId: string | null;
  setSelectedSatelliteId: (id: string | null) => void;
