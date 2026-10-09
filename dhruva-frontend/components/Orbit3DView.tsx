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
