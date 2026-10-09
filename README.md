<div align="center">

<img src="screenshots/logo-full.png" alt="Dhruva CDM" width="560"/>

**Autonomous Constellation Management & Conjunction Decision Support Platform**

[![GitHub Stars](https://img.shields.io/github/stars/jeevankumar-m/project-dhruva?style=flat-square&logo=github&color=1f6feb&label=stars)](https://github.com/jeevankumar-m/project-dhruva/stargazers) [![GitHub Watchers](https://img.shields.io/github/watchers/jeevankumar-m/project-dhruva?style=flat-square&logo=github&color=238636&label=watchers)](https://github.com/jeevankumar-m/project-dhruva/watchers) [![GitHub Forks](https://img.shields.io/github/forks/jeevankumar-m/project-dhruva?style=flat-square&logo=github&color=f0883e&label=forks)](https://github.com/jeevankumar-m/project-dhruva/network/members) [![Docker Build](https://img.shields.io/badge/Docker-Build-2496ED?style=flat-square&logo=docker&logoColor=white)](https://github.com/jeevankumar-m/project-dhruva#quick-start)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Screenshots](#screenshots)
- [System Architecture](#system-architecture)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [API Reference](#api-reference)
- [WebSocket Stream](#websocket-stream)
- [How to Add Satellite and Debris Data](#how-to-add-satellite-and-debris-data)
- [Testing Guide](#testing-guide)
- [Physics Model Summary](#physics-model-summary)
- [Operational Limits and Constraints](#operational-limits-and-constraints)
- [Troubleshooting](#troubleshooting)

---

## Overview

Dhruva CDM simulates satellite and debris motion in Earth orbit, evaluates close-approach risk, and supports maneuver scheduling with operational constraints such as communication blackout windows, command latency, cooldown constraints, and fuel feasibility.

The platform has two primary execution modes:

- `Live Stream Mode`: optimized for UI smoothness, uses WebSocket snapshots and grid-based conjunction prefiltering.
- `Step/Batch Mode`: optimized for backend evaluation speed, uses step-based simulation and KD-tree conjunction prefiltering.

---

## Key Features

- Real-time orbit visualization and conjunction updates over WebSocket.
- Conjunction warning generation with `SAFE`, `WARNING`, `CRITICAL` risk levels.
- Maneuver scheduling API with LOS, fuel, latency, and cooldown validations.
- TLE ingestion pipeline with SGP4 propagation and frame transformation to simulation state vectors.
- CDM-style CSV stress-loading pipeline for large debris test campaigns.
- Blackout status estimation and recovery ETA.
- Autonomous graveyard routing based on low-fuel threshold.
- Mission metrics: fuel usage, uptime, outage accumulation, and avoidance efficiency.
- Frontend dashboard with 2D Mercator ground track (90-min historical trail + dashed 90-min predicted trajectory, accurate terminator line), 3D Cesium orbit view, conjunction bullseye plot, maneuver Gantt timeline, and dedicated fleet fuel page.

---

## Screenshots

### 1. Ground Track — 2D Map Dashboard
![Ground Track Dashboard](screenshots/1.png)

Main dashboard displaying the real-time ground track of the constellation on a 2D Mercator map. Shows satellite positions, ground station overlays (e.g., Goldstone Tracking, IIT Delhi Ground Node, ISTRAC Bengaluru), telemetry summary (link quality, velocity), constellation contents, and active blackout status for each satellite.

---

### 2. Dashboard with Maneuver Timeline
![Dashboard with Maneuver Timeline](screenshots/2.png)

Extended dashboard view showing the ground track alongside the **Maneuver Timeline** panel at the bottom, which visualizes scheduled and executed burns across the simulation stream for each satellite in the fleet.

---

### 3. 3D Orbit Tracker — Polar View (Cesium)
![3D Orbit Tracker Polar View](screenshots/3.png)

Worldwide 3D perspective of the constellation using the Cesium globe renderer, viewed from a polar angle. Satellites and their orbital trails are rendered on the Earth's surface, with constellation health and blackout status displayed on the right panel.

---

### 4. 3D Orbit Tracker — Close Orbit View (Cesium)
![3D Orbit Tracker Close View](screenshots/4.png)

Close-up 3D orbit view showing a satellite's orbital ground track arcing over a landmass. Highlights individual satellite telemetry (SAT-Alpha-07) including fuel mass, dry mass, altitude, and longitude on the right panel. Blackout events for multiple satellites are also listed.

---

### 5. 3D Orbit Tracker — Full Constellation Globe View (Cesium)
![3D Full Constellation Globe View](screenshots/5.png)

Full worldwide 3D globe view of the entire constellation with all satellite positions and orbital tracks rendered simultaneously, giving an at-a-glance overview of fleet coverage and spacing.

---

### 6. Conjunction Bullseye — Extended View
![Conjunction Bullseye Extended View](screenshots/6.png)

Enlarged conjunction bullseye radar plot for a selected satellite (SAT-Alpha-07). Displays the predicted closest approach point relative to the satellite's reference frame, with colour-coded risk zones (Dhruva 1 km, Warning 2 km, Outer 5 km) and a conjunction list with miss distances.

---

### 7. Fleet Fuel & ΔV Analysis
![Fleet Fuel and DeltaV Analysis](screenshots/7.png)

Fleet-wide fuel and delta-V analytics page. Shows per-satellite propellant budget bars, total ΔV consumed (124.11 m/s), collision avoidance score, and a rolling history chart comparing ΔV consumed against collisions avoided over the simulation window.

---

### 8. Reports — Burn Logs
![Burn Logs Report](screenshots/8.png)

Reports section listing the full burn log for the current simulation stream. Each entry shows the burn ID, satellite, time (UTC), delta-V in m/s, and execution status (Executed / Rejected), providing a complete audit trail of all maneuver decisions.

---

### 9. Graveyard Orbit Monitor
![Graveyard Orbit Monitor](screenshots/9.png)

Graveyard orbit monitor that automatically tracks satellites moved to graveyard mode when their fuel falls below the critical threshold. Displays satellite ID and the trigger condition, ensuring decommissioned assets are flagged and tracked.

---

### 10. CDM Alerts
![CDM Alerts](screenshots/10.png)

Conjunction Data Message (CDM) alerts dashboard showing current active conjunction warnings for the fleet. Entries are sorted by miss distance and time to closest approach, with columns for satellite, debris object, miss distance, time range, and alert level.

---

### 11. Genesis Engine — Collision Prediction (Pre-Maneuver)
![Genesis Collision Prediction Pre-Maneuver](screenshots/genesis1.png)

Orbital plot from the Genesis autonomous maneuver planning engine showing the predicted point of collision between a satellite (green marker) and debris (red marker) before any avoidance burn is executed. The predicted collision point is highlighted on the orbit circle.

---

### 12. Genesis Engine — Collision Prediction (Alternate Geometry)
![Genesis Collision Prediction Alternate](screenshots/genesis2.png)

Another Genesis orbital plot showing a close-approach scenario where the satellite and debris tracks converge. The predicted collision point shifts depending on the relative geometry of the two objects' orbits.

---

### 13. Genesis Engine — Post-Maneuver Avoidance Visualization
![Genesis Post-Maneuver Avoidance](screenshots/genesis3.png)

Post-maneuver Genesis plot showing the **next predicted point of collision** after a burn has been executed. The previous burn point (magenta) is marked on the orbit, and the satellite's new orbital path (green) diverges from the debris track (red), confirming a successful avoidance trajectory.

---

## System Architecture

- Backend: `FastAPI` application in `server.py` and `api/routes.py`.
- State/physics core: `engine/sim_state.py`, `engine/conjunction.py`, `physics.py`.
- Frontend: `Next.js` application in `dhruva-frontend/`.
- Live transport: WebSocket endpoint at `WS /orbit`.
- Snapshot endpoint: `GET /api/visualization/snapshot`.

Data flow:

1. Objects are ingested (`/api/telemetry`, `/api/telemetry/tle`, or `/api/debug/load_cdm_csv`).
2. State is propagated using RK4 with central gravity + J2 perturbation.
3. Conjunction candidates are filtered (`grid` or `kdtree`) and evaluated over a prediction horizon.
4. Warnings and metrics are exposed through snapshot and stream payloads.
5. Frontend renders map/3D/orbit/analytics panels from backend output.

---

## Repository Structure

```text
Project-dhruva/
├── server.py                    # FastAPI app + websocket stream loop
├── api/
│   └── routes.py                # REST API endpoints
├── engine/
│   ├── sim_state.py             # Core simulation state and mission logic
│   ├── conjunction.py           # Grid/KD-tree conjunction filtering and TCA prediction
│   ├── tle_utils.py             # TLE -> state vector transformation
