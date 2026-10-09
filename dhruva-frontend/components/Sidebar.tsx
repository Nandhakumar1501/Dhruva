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
