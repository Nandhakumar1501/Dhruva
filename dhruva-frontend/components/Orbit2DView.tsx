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
