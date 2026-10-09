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

