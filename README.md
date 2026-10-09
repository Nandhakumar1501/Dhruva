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
