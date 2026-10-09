"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: "grid", href: "/" },
  { id: "fuel", label: "Fleet Fuel", icon: "fuel", href: "/fuel" },
  { id: "logs", label: "Burn Logs", icon: "doc", href: "/reports" },
  { id: "stationkeeping", label: "Station-Keeping", icon: "target", href: "/stationkeeping" },
  { id: "graveyard", label: "Graveyard Orbit", icon: "archive", href: "/graveyard" },
  { id: "alerts", label: "CDM Alerts", icon: "bell", href: "/alerts" },
  { id: "settings", label: "Settings", icon: "gear", href: "/settings" },
];

const icons: Record<string, React.ReactNode> = {
  grid: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  doc: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  bell: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  ),
  archive: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
