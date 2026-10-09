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
