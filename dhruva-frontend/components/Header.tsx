"use client";

interface HeaderProps {
  status: "connecting" | "live" | "degraded" | "disconnected" | "error";
  timestamp: string | null;
  timeWarpX: number;
  onDecreaseTimeWarp: () => void;
  onIncreaseTimeWarp: () => void;
}

export default function Header({
  status,
  timestamp,
  timeWarpX,
  onDecreaseTimeWarp,
  onIncreaseTimeWarp,
}: HeaderProps) {
  const isLive = status === "live";
  const isDegraded = status === "degraded";
  const statusLabel = status.toUpperCase();
  const statusDotClass = isLive ? "bg-emerald-400 shadow-[0_0_6px_#34d399]" : isDegraded ? "bg-amber-400" : "bg-slate-500";
  const statusTextClass = isLive ? "text-emerald-300 border-emerald-600/60" : isDegraded ? "text-amber-300 border-amber-600/60" : "text-slate-400 border-slate-600";

  return (
    <header className="h-12 border-b border-slate-700/50 bg-slate-950/98 backdrop-blur-sm px-4 flex items-center justify-between" style={{ boxShadow: "0 1px 0 rgba(6,182,212,0.08)" }}>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3.5" stroke="#22d3ee" strokeWidth="1.5" />
            <ellipse cx="12" cy="12" rx="9" ry="4" stroke="#22d3ee" strokeWidth="1" strokeOpacity="0.5" />
            <ellipse cx="12" cy="12" rx="4" ry="9" stroke="#22d3ee" strokeWidth="1" strokeOpacity="0.35" transform="rotate(45 12 12)" />
          </svg>
          <div>
            <div className="text-sm font-bold tracking-widest text-slate-100" style={{ letterSpacing: "0.12em" }}>DHRUVA</div>
          </div>
        </div>
        <div className="h-5 w-px bg-slate-700" />
        <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest hidden sm:block">Autonomous Constellation Manager</div>
      </div>

