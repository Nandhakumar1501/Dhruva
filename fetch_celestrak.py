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
ST_QUERY = f"{ST_BASE}/basicspacedata/query"
BATCH_SIZE = 50

# Space-Track query URLs — TLE format
FEEDS = {
    "satellites": {
        "url": f"{ST_QUERY}/class/gp/MEAN_MOTION/>11.25/ECCENTRICITY/<0.25/OBJECT_TYPE/PAYLOAD/orderby/NORAD_CAT_ID/limit/{{limit}}/format/tle",
        "object_type": "SATELLITE",
        "label": "Active LEO Satellites",
    },
    "cosmos_debris": {
        "url": f"{ST_QUERY}/class/gp/OBJECT_NAME/COSMOS 2251 DEB/OBJECT_TYPE/DEBRIS/orderby/NORAD_CAT_ID/limit/{{limit}}/format/tle",
        "object_type": "DEBRIS",
        "label": "Cosmos 2251 Debris",
    },
    "fengyun_debris": {
        "url": f"{ST_QUERY}/class/gp/OBJECT_NAME/FENGYUN 1C DEB/OBJECT_TYPE/DEBRIS/orderby/NORAD_CAT_ID/limit/{{limit}}/format/tle",
        "object_type": "DEBRIS",
        "label": "Fengyun-1C Debris",
    },
    "iridium_debris": {
        "url": f"{ST_QUERY}/class/gp/OBJECT_NAME/IRIDIUM 33 DEB/OBJECT_TYPE/DEBRIS/orderby/NORAD_CAT_ID/limit/{{limit}}/format/tle",
        "object_type": "DEBRIS",
        "label": "Iridium-33 Debris",
    },
}


def login(session: requests.Session) -> bool:
    if ST_USER == "your_email@example.com":
        print("\nSet ST_USER and ST_PASS in the script first.")
        print("Register free at: https://www.space-track.org")
        return False
    try:
        resp = session.post(ST_LOGIN, data={"identity": ST_USER, "password": ST_PASS}, timeout=15)
        if resp.status_code == 200 and "Login" not in resp.text:
            print(f"Space-Track: Logged in as {ST_USER}")
            return True
        print(f"Space-Track login failed. Check credentials.")
        return False
