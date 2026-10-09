"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import Earth from "./Earth";

type Vec2 = { x: number; y: number };

type Conjunction = {
  tca_seconds: number;
  miss_distance_km: number;
  satellite: [number, number];
  debris: [number, number];
} | null;

interface Props {
  sat: Vec2;
  deb: Vec2;
  satTrail: Vec2[];
  debTrail: Vec2[];
  conjunction?: Conjunction;
  showEncounter?: boolean;
}

const SCALE = 1 / 1000; // km -> scene units

export default function Orbit3DView({
  sat,
  deb,
  satTrail,
  debTrail,
  conjunction,
  showEncounter,
}: Props) {
  const satPos: [number, number, number] = [sat.x * SCALE, sat.y * SCALE, 0];
  const debPos: [number, number, number] = [deb.x * SCALE, deb.y * SCALE, 0];

  const satTrackPoints: [number, number, number][] = satTrail.map((p) => [
    p.x * SCALE,
    p.y * SCALE,
