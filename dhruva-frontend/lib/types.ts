export type RiskLevel = "SAFE" | "WARNING" | "CRITICAL";

export interface SatelliteSnapshot {
  id: string;
  lat: number;
  lon: number;
  altitude_km: number;
  fuel_kg: number;
  planned_fuel_kg?: number;
  planned_mass_kg?: number;
  status: "NOMINAL" | "OUT_OF_BOX" | "GRAVEYARD" | string;
  drift_km: number;
  in_graveyard_orbit?: boolean;
  graveyard_entry_time?: string | null;
  nominal: {
    lat: number;
    lon: number;
    altitude_km: number;
  };
  eci?: {
