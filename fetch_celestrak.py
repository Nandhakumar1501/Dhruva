"""
Space-Track.org TLE Ingestion Script — Dhruva CDM

Fetches real satellite and debris TLE data from Space-Track.org (official USAF source)
and ingests it into a running Dhruva CDM backend.

Setup:
    1. Create a free account at https://www.space-track.org
    2. Set your credentials below (ST_USER and ST_PASS)
    3. Make sure Dhruva CDM backend is running
    4. Run: python fetch_celestrak.py

Usage:
    python fetch_celestrak.py                    # load satellites + debris
    python fetch_celestrak.py --satellites-only
    python fetch_celestrak.py --debris-only
    python fetch_celestrak.py --limit 100        # cap per feed (default 100)

Requires: pip install requests
"""

import argparse
from datetime import datetime, timedelta, timezone
import sys

try:
    import requests
except ImportError:
    print("Run: pip install requests")
    sys.exit(1)

# ── CONFIGURE YOUR SPACE-TRACK CREDENTIALS HERE ──────────────────────────────
ST_USER = "jeevankumar06m@gmail.com"
ST_PASS = "LrBT7SHj_3N!Yem"
# ─────────────────────────────────────────────────────────────────────────────

BACKEND_URL = "http://localhost:8000"
TLE_ENDPOINT = f"{BACKEND_URL}/api/telemetry/tle"
ST_BASE = "https://www.space-track.org"
ST_LOGIN = f"{ST_BASE}/ajaxauth/login"
