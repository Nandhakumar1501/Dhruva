from __future__ import annotations

import csv
from datetime import datetime
from pathlib import Path
from typing import Any, Literal

import numpy as np
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from engine.models import ManeuverCommand
from engine.sim_state import SimulationState
from engine.tle_utils import tle_to_gcrs_state_km_kms


class VecModel(BaseModel):
    x: float
    y: float
    z: float


class TelemetryObject(BaseModel):
    id: str
    type: str
    r: VecModel
    v: VecModel


class TelemetryRequest(BaseModel):
    timestamp: datetime
    objects: list[TelemetryObject]


class TleObject(BaseModel):
    id: str
    object_type: Literal["SATELLITE", "DEBRIS"] = "SATELLITE"
    tle_line1: str
    tle_line2: str
    timestamp: datetime


class TleTelemetryRequest(BaseModel):
    objects: list[TleObject]


class ManeuverItem(BaseModel):
    burn_id: str
    burnTime: datetime
    deltaV_vector: VecModel


class ManeuverRequest(BaseModel):
    satelliteId: str
    maneuver_sequence: list[ManeuverItem]


class StepRequest(BaseModel):
    step_seconds: int = Field(gt=0)


class SeedRequest(BaseModel):
    satellite_count: int = Field(default=50, ge=1, le=200)
    debris_count: int = Field(default=20, ge=1, le=20000)


class TimeWarpRequest(BaseModel):
    multiplier: int


class CdmCsvLoadRequest(BaseModel):
    csv_path: str = "test_data/debris_data.csv"
    max_rows: int = Field(default=1000, ge=1, le=20000)
    replace_existing: bool = False
    id_prefix: str = "CDM-DEB"


def _rtn_basis_from_state(state_vec: np.ndarray) -> tuple[np.ndarray, np.ndarray, np.ndarray] | None:
    r = state_vec[:3]
    v = state_vec[3:6]
    r_norm = float(np.linalg.norm(r))
    if r_norm < 1e-10:
        return None
    r_hat = r / r_norm
    h = np.cross(r, v)
    h_norm = float(np.linalg.norm(h))
    if h_norm < 1e-10:
        return None
    n_hat = h / h_norm
    t_hat = np.cross(n_hat, r_hat)
    t_norm = float(np.linalg.norm(t_hat))
    if t_norm < 1e-10:
        return None
    t_hat = t_hat / t_norm
    return r_hat, t_hat, n_hat


def _safe_float(row: dict[str, str], key: str) -> float | None:
    raw = row.get(key)
    if raw is None or raw == "":
        return None
    try:
        return float(raw)
    except ValueError:
        return None


def build_router(state: SimulationState) -> APIRouter:
    router = APIRouter(prefix="/api")

    @router.post("/telemetry")
    async def telemetry(payload: TelemetryRequest) -> dict[str, Any]:
        processed = 0
        for obj in payload.objects:
            obj_type = "SATELLITE" if obj.type.upper() in {"SAT", "SATELLITE"} else "DEBRIS"
            state_vec = np.array([obj.r.x, obj.r.y, obj.r.z, obj.v.x, obj.v.y, obj.v.z], dtype=float)
            state.ingest_object(obj.id, obj_type, state_vec)
            processed += 1

        state.current_time = payload.timestamp
        state.conjunctions = state.conjunctions

        return {
            "status": "ACK",
            "processed_count": processed,
            "active_cdm_warnings": len(state.conjunctions),
        }

    @router.post("/telemetry/tle")
    async def telemetry_tle(payload: TleTelemetryRequest) -> dict[str, Any]:
        """
        Ingest TLEs, propagate with SGP4, convert TEME->GCRS (ECI-like),
        and ingest as state vectors (km, km/s).
        """
        processed = 0

        # Keep simulation time aligned with the last ingested object timestamp.
        last_ts: datetime | None = None
        for obj in payload.objects:
            try:
                epoch_iso = obj.timestamp.isoformat()
                state_vec = tle_to_gcrs_state_km_kms(obj.tle_line1, obj.tle_line2, epoch_iso)
                state_vec = np.asarray(state_vec, dtype=float)
                state.ingest_object(obj.id, obj.object_type, state_vec)
                processed += 1
                last_ts = obj.timestamp
            except Exception:
                continue

        if last_ts is not None:
            state.current_time = last_ts

        return {
            "status": "ACK",
            "processed_count": processed,
            "active_cdm_warnings": len(state.conjunctions),
            "last_timestamp": last_ts.isoformat() if last_ts else None,
        }

    @router.post("/maneuver/schedule", status_code=202)
    async def schedule_maneuver(payload: ManeuverRequest) -> dict[str, Any]:
        sat = state.satellites.get(payload.satelliteId)
        if sat is None:
            raise HTTPException(status_code=404, detail=f"Unknown satellite: {payload.satelliteId}")

        commands = [
            ManeuverCommand(
                burn_id=item.burn_id,
                satellite_id=payload.satelliteId,
                burn_time=item.burnTime,
                delta_v_eci_kmps=np.array([item.deltaV_vector.x, item.deltaV_vector.y, item.deltaV_vector.z], dtype=float),
            )
            for item in payload.maneuver_sequence
        ]

        los_ok, fuel_ok, projected_mass = state.schedule_maneuvers(payload.satelliteId, commands)
        status = "SCHEDULED" if (los_ok and fuel_ok) else "REJECTED"

        return {
            "status": status,
            "validation": {
                "ground_station_los": los_ok,
                "sufficient_fuel": fuel_ok,
                "projected_mass_remaining_kg": projected_mass,
            },
        }

    @router.post("/simulate/step")
    async def simulate_step(payload: StepRequest) -> dict[str, Any]:
        summary = state.step(payload.step_seconds)
        return {
            "status": "STEP_COMPLETE",
            "new_timestamp": state.current_time.isoformat(),
            "collisions_detected": summary.collisions_detected,
            "maneuvers_executed": summary.maneuvers_executed,
        }

    @router.get("/visualization/snapshot")
    async def visualization_snapshot() -> dict[str, Any]:
        # Snapshot should be read-only and fast. Simulation advancement is
        # handled by the stream loop.
        return state.snapshot()

    @router.post("/debug/seed")
    async def debug_seed(payload: SeedRequest) -> dict[str, Any]:
        state.seed_default_scenario(
            satellite_count=payload.satellite_count,
            debris_count=payload.debris_count,
        )
        return {
            "status": "SEEDED",
            "satellites": len(state.satellites),
            "debris": len(state.debris),
            "active_cdm_warnings": len(state.conjunctions),
        }

    @router.post("/debug/load_cdm_csv")
    async def debug_load_cdm_csv(payload: CdmCsvLoadRequest) -> dict[str, Any]:
        csv_file = Path(payload.csv_path)
        if not csv_file.is_absolute():
            csv_file = Path.cwd() / csv_file
        if not csv_file.exists():
            raise HTTPException(status_code=404, detail=f"CSV not found: {csv_file}")

        sat_list = list(state.satellites.values())
        if not sat_list:
            raise HTTPException(status_code=422, detail="No satellites available to anchor RTN conversion")

        if payload.replace_existing:
            state.debris.clear()

        loaded = 0
        skipped = 0

        with csv_file.open("r", encoding="utf-8", newline="") as f:
            reader = csv.DictReader(f)
            for row_idx, row in enumerate(reader, start=1):
                if loaded >= payload.max_rows:
                    break

