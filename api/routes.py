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
