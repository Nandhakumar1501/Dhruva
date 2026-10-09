"use client";

import { useEffect, useRef } from "react";

type Vec2 = { x: number; y: number };

interface Props {
  sat: Vec2;
  deb: Vec2;
  satTrail: Vec2[];
  debTrail: Vec2[];
}

const SCALE = 1 / 40; // km -> px scaling at typical LEO radius

export default function Orbit2DView({ sat, deb, satTrail, debTrail }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height * 0.55;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, width, height);

    const baseRadius = 160 * SCALE * 100; // arbitrary normalized Earth radius

    ctx.save();
    const grd = ctx.createRadialGradient(
      cx,
      cy - baseRadius * 0.6,
      baseRadius * 0.1,
