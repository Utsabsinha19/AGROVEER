'use client';

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, ContactShadows, Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';

export type InspectableMachineType = 
  | 'engine-170f'
  | 'earth-auger-ea85'
  | 'water-pump-wp30'
  | 'cordless-bag-closer'
  | 'sawking-chain-gold';

export interface HotspotPin {
  id: string;
  position: [number, number, number];
  title: string;
  highlight: string;
  description: string;
}

// ==========================================
// 1. Agroveer 170F 7.5 HP Petrol Engine Model
// ==========================================
function Engine170FModel({ 
  isExploded, 
  isRunning, 
  activeHotspot, 
  onSelectHotspot 
}: { 
  isExploded: boolean; 
  isRunning: boolean;
  activeHotspot: string | null; 
  onSelectHotspot: (id: string) => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const pulleyRef = useRef<THREE.Group>(null!);
  const recoilRef = useRef<THREE.Group>(null!);
  const tankRef = useRef<THREE.Group>(null!);
  const mufflerRef = useRef<THREE.Group>(null!);
  const airFilterRef = useRef<THREE.Group>(null!);
  const fanRef = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const explodeT = isExploded ? 1 : 0;

    // Smooth engine vibration when running
    if (groupRef.current) {
      const vib = isRunning ? Math.sin(t * 36) * 0.0016 : 0;
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -0.1 + vib, 0.1);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, vib * 1.5, 0.1);
    }

    // Real-time kinetic spinning of dual-groove pulley & internal fan
    if (pulleyRef.current && isRunning) {
      pulleyRef.current.rotation.z += delta * 14;
    }
    if (fanRef.current && isRunning) {
      fanRef.current.rotation.z += delta * 24;
    }

    // Smooth Exploded View Lerping
    if (recoilRef.current) {
      recoilRef.current.position.z = THREE.MathUtils.lerp(recoilRef.current.position.z, 0.38 + explodeT * 0.45, 0.08);
    }
    if (tankRef.current) {
      tankRef.current.position.y = THREE.MathUtils.lerp(tankRef.current.position.y, 0.35 + explodeT * 0.35, 0.08);
    }
    if (mufflerRef.current) {
      mufflerRef.current.position.x = THREE.MathUtils.lerp(mufflerRef.current.position.x, -0.42 - explodeT * 0.35, 0.08);
    }
    if (airFilterRef.current) {
      airFilterRef.current.position.x = THREE.MathUtils.lerp(airFilterRef.current.position.x, 0.42 + explodeT * 0.35, 0.08);
    }
    if (pulleyRef.current) {
      pulleyRef.current.position.z = THREE.MathUtils.lerp(pulleyRef.current.position.z, -0.48 - explodeT * 0.4, 0.08);
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.1, 0]}>
      {/* 25mm Steel Roll Cage Tubular Frame */}
      <group>
        {/* Bottom Rails */}
        <mesh position={[0, -0.75, 0.45]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.042, 0.042, 1.65, 20]} />
          <meshPhysicalMaterial color="#161B18" metalness={0.88} roughness={0.25} clearcoat={0.6} />
        </mesh>
        <mesh position={[0, -0.75, -0.45]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.042, 0.042, 1.65, 20]} />
          <meshPhysicalMaterial color="#161B18" metalness={0.88} roughness={0.25} clearcoat={0.6} />
        </mesh>
        {/* Upright Corner Supports */}
        {[-0.8, 0.8].map((x, i) => (
          <React.Fragment key={i}>
            <mesh position={[x, -0.1, 0.45]}>
              <cylinderGeometry args={[0.042, 0.042, 1.32, 20]} />
              <meshPhysicalMaterial color="#161B18" metalness={0.88} roughness={0.25} clearcoat={0.6} />
            </mesh>
            <mesh position={[x, -0.1, -0.45]}>
              <cylinderGeometry args={[0.042, 0.042, 1.32, 20]} />
              <meshPhysicalMaterial color="#161B18" metalness={0.88} roughness={0.25} clearcoat={0.6} />
            </mesh>
          </React.Fragment>
        ))}
        {/* Top Ergonomic Handles */}
        <mesh position={[0, 0.56, 0.45]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.042, 0.042, 1.65, 20]} />
          <meshPhysicalMaterial color="#161B18" metalness={0.88} roughness={0.25} clearcoat={0.6} />
        </mesh>
        <mesh position={[0, 0.56, -0.45]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.042, 0.042, 1.65, 20]} />
          <meshPhysicalMaterial color="#161B18" metalness={0.88} roughness={0.25} clearcoat={0.6} />
        </mesh>
        {/* Rubber Anti-Vibration Base Feet */}
        {[-0.6, 0.6].map((x, i) => (
          <React.Fragment key={i}>
            <mesh position={[x, -0.82, 0.45]}>
              <cylinderGeometry args={[0.07, 0.07, 0.08, 16]} />
              <meshPhysicalMaterial color="#0B0E0D" roughness={0.9} />
            </mesh>
            <mesh position={[x, -0.82, -0.45]}>
              <cylinderGeometry args={[0.07, 0.07, 0.08, 16]} />
              <meshPhysicalMaterial color="#0B0E0D" roughness={0.9} />
            </mesh>
          </React.Fragment>
        ))}
      </group>

      {/* Engine Crankcase (Sand-Cast Aluminum Alloy) */}
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[0.88, 0.68, 0.68]} />
        <meshPhysicalMaterial color="#889396" metalness={0.85} roughness={0.32} clearcoat={0.3} reflectivity={0.8} />
      </mesh>
      {/* Crankcase Oil Drain Plug & Dipstick */}
      <mesh position={[0.38, -0.56, 0.32]} rotation={[0.4, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.12, 16]} />
        <meshPhysicalMaterial color="#E5A93B" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Slanted OHV Cylinder Block & Cast Iron Sleeve */}
      <group position={[-0.15, 0.15, 0]} rotation={[0, 0, -0.3]}>
        <mesh>
          <cylinderGeometry args={[0.29, 0.33, 0.66, 32]} />
          <meshPhysicalMaterial color="#2B3033" metalness={0.78} roughness={0.35} />
        </mesh>
        {/* Cooling Fins with High Reflective Chamfers */}
        {[-0.18, -0.09, 0.0, 0.09, 0.18].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <cylinderGeometry args={[0.36, 0.36, 0.02, 32]} />
            <meshPhysicalMaterial color="#171A1C" metalness={0.88} roughness={0.22} clearcoat={0.4} />
          </mesh>
        ))}
        {/* Overhead Valve (OHV) Rocker Cover with Agroveer Stamp */}
        <mesh position={[0, 0.38, 0]}>
          <boxGeometry args={[0.44, 0.14, 0.44]} />
          <meshPhysicalMaterial color="#A4ADB0" metalness={0.9} roughness={0.2} clearcoat={0.5} />
        </mesh>
        {/* Spark Plug & High-Tension Lead */}
        <mesh position={[0.16, 0.36, 0]} rotation={[0, 0, 0.5]}>
          <cylinderGeometry args={[0.028, 0.028, 0.18, 16]} />
          <meshPhysicalMaterial color="#EEEEEE" roughness={0.3} metalness={0.4} />
        </mesh>
      </group>

      {/* Agroveer Red Powder-Coated Fuel Tank (Exploded Lerp) */}
      <group ref={tankRef} position={[0.06, 0.35, 0]}>
        <mesh>
          <boxGeometry args={[0.84, 0.36, 0.64]} />
          <meshPhysicalMaterial color="#D64527" roughness={0.18} metalness={0.25} clearcoat={0.9} clearcoatRoughness={0.1} />
        </mesh>
        {/* Threaded Metal Fuel Cap with Viton Seal */}
        <mesh position={[0.22, 0.22, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.08, 32]} />
          <meshPhysicalMaterial color="#111413" metalness={0.9} roughness={0.25} />
        </mesh>
        {/* Brand Label Decal Strip */}
        <mesh position={[0, 0.04, 0.325]}>
          <planeGeometry args={[0.55, 0.18]} />
          <meshPhysicalMaterial color="#FFFFFF" roughness={0.4} />
        </mesh>
      </group>

      {/* Recoil Starter Assembly in Agroveer Red (Front Face) */}
      <group ref={recoilRef} position={[0, -0.3, 0.38]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.34, 0.34, 0.12, 36]} />
          <meshPhysicalMaterial color="#D64527" roughness={0.2} metalness={0.3} clearcoat={0.85} />
        </mesh>
        {/* Slotted Air Ventilation Rings */}
        <mesh position={[0, 0.065, 0]}>
          <ringGeometry args={[0.12, 0.28, 32]} />
          <meshPhysicalMaterial color="#111413" roughness={0.6} side={THREE.DoubleSide} />
        </mesh>
        {/* Internal Fan Visible through Shroud */}
        <group ref={fanRef} position={[0, -0.02, 0]}>
          {[0, 45, 90, 135].map((deg, i) => (
            <mesh key={i} rotation={[0, 0, (deg * Math.PI) / 180]}>
              <boxGeometry args={[0.48, 0.04, 0.02]} />
              <meshPhysicalMaterial color="#C5CFD2" metalness={0.7} roughness={0.3} />
            </mesh>
          ))}
        </group>
        {/* Recoil Ergonomic T-Handle & Braided Cord */}
        <mesh position={[0.26, 0.22, 0.06]} rotation={[0, 0, -0.5]}>
          <cylinderGeometry args={[0.032, 0.032, 0.18, 16]} />
          <meshPhysicalMaterial color="#0F1211" roughness={0.8} />
        </mesh>
      </group>

      {/* Output Drive Shaft & Dual-Groove Pulley (Rear Face) */}
      <group ref={pulleyRef} position={[0, -0.3, -0.48]} rotation={[Math.PI / 2, 0, 0]}>
        {/* 20mm Keyed Crankshaft */}
        <mesh position={[0, -0.08, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.2, 24]} />
          <meshPhysicalMaterial color="#A5B0B4" metalness={0.95} roughness={0.15} />
        </mesh>
        {/* Dual-Groove CNC Machined Pulley in Golden Tooling Steel */}
        <mesh>
          <cylinderGeometry args={[0.32, 0.32, 0.14, 40]} />
          <meshPhysicalMaterial color="#D4AF37" metalness={0.92} roughness={0.18} clearcoat={0.7} />
        </mesh>
        {/* Two V-Belt Grooves */}
        {[-0.035, 0.035].map((z, idx) => (
          <mesh key={idx} position={[0, z, 0]}>
            <cylinderGeometry args={[0.25, 0.33, 0.025, 32]} />
            <meshPhysicalMaterial color="#0A0C0B" roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* Heavy-Duty Industrial Air Filter (Right Side) */}
      <group ref={airFilterRef} position={[0.42, 0.15, -0.1]}>
        <mesh>
          <boxGeometry args={[0.26, 0.32, 0.34]} />
          <meshPhysicalMaterial color="#1E2320" roughness={0.65} clearcoat={0.3} />
        </mesh>
        {/* Dual Clamping Latches */}
        <mesh position={[0.135, 0, 0]}>
          <boxGeometry args={[0.02, 0.08, 0.04]} />
          <meshPhysicalMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Silenced Exhaust Muffler with Heat Guard (Left Side) */}
      <group ref={mufflerRef} position={[-0.42, 0.15, -0.1]}>
        <mesh>
          <boxGeometry args={[0.28, 0.36, 0.38]} />
          <meshPhysicalMaterial color="#212527" metalness={0.88} roughness={0.32} />
        </mesh>
        {/* Perforated Heat Shield Slots */}
        <mesh position={[-0.145, 0, 0]}>
          <planeGeometry args={[0.01, 0.28]} />
          <meshPhysicalMaterial color="#0A0C0B" />
        </mesh>
      </group>

      {/* 3D Hotspot Pins */}
      <Html position={[0, 0.58, 0.48]} center>
        <button
          onClick={() => onSelectHotspot('hotspot-frame')}
          className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md border text-[10px] font-mono font-bold transition-all shadow-lg ${
            activeHotspot === 'hotspot-frame'
              ? 'bg-[#A6C96A] text-[#102C22] border-[#A6C96A] scale-110'
              : 'bg-[#141A17]/80 text-[#F7F5F0] border-[#A6C96A]/40 hover:scale-105'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#D64527] animate-ping" />
          <span>25mm Roll Frame</span>
        </button>
      </Html>

      <Html position={[0.28, -0.28, 0.5]} center>
        <button
          onClick={() => onSelectHotspot('hotspot-recoil')}
          className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md border text-[10px] font-mono font-bold transition-all shadow-lg ${
            activeHotspot === 'hotspot-recoil'
              ? 'bg-[#A6C96A] text-[#102C22] border-[#A6C96A] scale-110'
              : 'bg-[#141A17]/80 text-[#F7F5F0] border-[#A6C96A]/40 hover:scale-105'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#A6C96A] animate-pulse" />
          <span>Super Easy Starter</span>
        </button>
      </Html>

      <Html position={[0, -0.3, -0.6]} center>
        <button
          onClick={() => onSelectHotspot('hotspot-pulley')}
          className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md border text-[10px] font-mono font-bold transition-all shadow-lg ${
            activeHotspot === 'hotspot-pulley'
              ? 'bg-[#A6C96A] text-[#102C22] border-[#A6C96A] scale-110'
              : 'bg-[#141A17]/80 text-[#F7F5F0] border-[#A6C96A]/40 hover:scale-105'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
          <span>Dual Pulley</span>
        </button>
      </Html>
    </group>
  );
}

// ==========================================
// 2. Agroveer EA-85 85CC Earth Auger Model
// ==========================================
function EarthAugerEA85Model({ 
  isExploded, 
  isRunning, 
  activeHotspot, 
  onSelectHotspot 
}: { 
  isExploded: boolean; 
  isRunning: boolean;
  activeHotspot: string | null; 
  onSelectHotspot: (id: string) => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const bitGroupRef = useRef<THREE.Group>(null!);
  const motorRef = useRef<THREE.Group>(null!);
  const handlesRef = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const explodeT = isExploded ? 1 : 0;

    // Real-time vibration and smooth rotation
    if (groupRef.current) {
      const vib = isRunning ? Math.sin(t * 40) * 0.0018 : 0;
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0.15 + vib, 0.1);
    }

    // Continuous drilling rotation of the manganese steel spiral bit
    if (bitGroupRef.current && isRunning) {
      bitGroupRef.current.rotation.y += delta * 12;
    }

    // Exploded View Lerping
    if (bitGroupRef.current) {
      bitGroupRef.current.position.y = THREE.MathUtils.lerp(bitGroupRef.current.position.y, -explodeT * 0.5, 0.08);
    }
    if (motorRef.current) {
      motorRef.current.position.y = THREE.MathUtils.lerp(motorRef.current.position.y, 0.2 + explodeT * 0.35, 0.08);
    }
    if (handlesRef.current) {
      handlesRef.current.position.y = THREE.MathUtils.lerp(handlesRef.current.position.y, 0.35 + explodeT * 0.2, 0.08);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.15, 0]}>
      {/* Heavy-Duty Tubular Handlebars */}
      <group ref={handlesRef} position={[0, 0.35, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.038, 0.038, 1.45, 20]} />
          <meshPhysicalMaterial color="#161B18" metalness={0.9} roughness={0.25} clearcoat={0.6} />
        </mesh>
        {/* Ergonomic Molded Rubber Grips */}
        {[-0.68, 0.68].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]}>
            <cylinderGeometry args={[0.052, 0.052, 0.24, 20]} />
            <meshPhysicalMaterial color="#0A0C0B" roughness={0.92} />
          </mesh>
        ))}
        {/* Right Accelerator Throttle Trigger & Safety Switch in Engine Vermilion */}
        <mesh position={[0.68, -0.06, 0.06]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.04, 0.1, 0.035]} />
          <meshPhysicalMaterial color="#D64527" roughness={0.3} metalness={0.2} />
        </mesh>
        {/* High-Tension Accelerator Wire */}
        <mesh position={[0.45, -0.1, 0.04]} rotation={[0, 0, 0.7]}>
          <cylinderGeometry args={[0.008, 0.008, 0.45, 8]} />
          <meshPhysicalMaterial color="#0A0C0B" roughness={0.8} />
        </mesh>
      </group>

      {/* 85CC 2-Stroke Powerhead Motor */}
      <group ref={motorRef} position={[0, 0.2, 0]}>
        <mesh>
          <cylinderGeometry args={[0.26, 0.29, 0.36, 32]} />
          <meshPhysicalMaterial color="#D64527" roughness={0.18} metalness={0.28} clearcoat={0.9} />
        </mesh>
        {/* Black Vented Cylinder Shroud */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.22, 0.26, 0.12, 32]} />
          <meshPhysicalMaterial color="#1A1D1C" roughness={0.65} metalness={0.7} />
        </mesh>
        {/* Recoil Starter Shroud with Agroveer Emblem */}
        <mesh position={[0, 0, 0.29]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.08, 32]} />
          <meshPhysicalMaterial color="#D64527" roughness={0.22} clearcoat={0.8} />
        </mesh>
        {/* Translucent HDPE Fuel Tank with 25:1 Mix Warning */}
        <mesh position={[0, -0.15, -0.22]}>
          <boxGeometry args={[0.48, 0.24, 0.16]} />
          <meshPhysicalMaterial 
            color="#FAFAF5" 
            roughness={0.35} 
            transmission={0.4} 
            thickness={0.1} 
            opacity={0.92} 
            transparent 
          />
        </mesh>
      </group>

      {/* Heavy-Duty Planetary Reduction Gearbox */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.18, 0.14, 0.26, 24]} />
        <meshPhysicalMaterial color="#4A5257" metalness={0.9} roughness={0.24} clearcoat={0.4} />
      </mesh>

      {/* Real-time Spinning Manganese Steel Spiral Bit (800mm Depth) */}
      <group ref={bitGroupRef} position={[0, 0, 0]}>
        {/* Central 20mm Solid Steel Core Rod */}
        <mesh position={[0, -0.65, 0]}>
          <cylinderGeometry args={[0.038, 0.038, 0.95, 20]} />
          <meshPhysicalMaterial color="#2B3033" metalness={0.95} roughness={0.18} />
        </mesh>

        {/* 5 Continuous Spiral Helical Flights */}
        {[-0.32, -0.48, -0.64, -0.80, -0.96].map((y, idx) => (
          <group key={idx} position={[0, y, 0]} rotation={[0.3, idx * 0.85, 0]}>
            <mesh>
              <cylinderGeometry args={[0.28, 0.28, 0.026, 32]} />
              <meshPhysicalMaterial color="#353D42" metalness={0.88} roughness={0.22} clearcoat={0.5} />
            </mesh>
            {/* Hardened Tungsten Cutter Edges */}
            <mesh position={[0.26, 0, 0]}>
              <boxGeometry args={[0.04, 0.03, 0.08]} />
              <meshPhysicalMaterial color="#D4AF37" metalness={0.95} roughness={0.1} />
            </mesh>
          </group>
        ))}

        {/* Centering Fishtail Pilot Point */}
        <mesh position={[0, -1.18, 0]}>
          <coneGeometry args={[0.07, 0.16, 20]} />
          <meshPhysicalMaterial color="#D4AF37" metalness={0.95} roughness={0.15} />
        </mesh>
      </group>

      {/* 3D Hotspot Pins */}
      <Html position={[0, 0.42, 0.3]} center>
        <button
          onClick={() => onSelectHotspot('hotspot-motor-85cc')}
          className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md border text-[10px] font-mono font-bold transition-all shadow-lg ${
            activeHotspot === 'hotspot-motor-85cc'
              ? 'bg-[#A6C96A] text-[#102C22] border-[#A6C96A] scale-110'
              : 'bg-[#141A17]/80 text-[#F7F5F0] border-[#A6C96A]/40 hover:scale-105'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#D64527] animate-ping" />
          <span>85cc 9000 RPM</span>
        </button>
      </Html>

      <Html position={[0.35, -0.65, 0.2]} center>
        <button
          onClick={() => onSelectHotspot('hotspot-spiral-bit')}
          className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md border text-[10px] font-mono font-bold transition-all shadow-lg ${
            activeHotspot === 'hotspot-spiral-bit'
              ? 'bg-[#A6C96A] text-[#102C22] border-[#A6C96A] scale-110'
              : 'bg-[#141A17]/80 text-[#F7F5F0] border-[#A6C96A]/40 hover:scale-105'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
          <span>Spiral Flight Bit</span>
        </button>
      </Html>
    </group>
  );
}

// ==========================================
// 3. Agroveer 3" High-Flow Water Pump Model
// ==========================================
function WaterPumpWP30Model({ 
  isExploded, 
  isRunning, 
  activeHotspot, 
  onSelectHotspot 
}: { 
  isExploded: boolean; 
  isRunning: boolean;
  activeHotspot: string | null; 
  onSelectHotspot: (id: string) => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const impellerRef = useRef<THREE.Group>(null!);
  const pumpCasingRef = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const explodeT = isExploded ? 1 : 0;

    // Pump running vibration
    if (groupRef.current) {
      const vib = isRunning ? Math.sin(t * 32) * 0.0014 : 0;
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -0.1 + vib, 0.1);
    }

    // High-speed impeller rotation (2800 RPM equivalent)
    if (impellerRef.current && isRunning) {
      impellerRef.current.rotation.z += delta * 18;
    }

    // Exploded View separation: pump volute moves forward to reveal the internal impeller
    if (pumpCasingRef.current) {
      pumpCasingRef.current.position.z = THREE.MathUtils.lerp(pumpCasingRef.current.position.z, 0.28 + explodeT * 0.45, 0.08);
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.1, 0]}>
      {/* 25mm Double-Handle Steel Tubular Roll Cage */}
      <group>
        <mesh position={[0, 0.55, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.042, 0.042, 1.75, 20]} />
          <meshPhysicalMaterial color="#161B18" metalness={0.9} roughness={0.25} clearcoat={0.6} />
        </mesh>
        <mesh position={[0, -0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.042, 0.042, 1.75, 20]} />
          <meshPhysicalMaterial color="#161B18" metalness={0.9} roughness={0.25} clearcoat={0.6} />
        </mesh>
        {[-0.82, 0.82].map((x, i) => (
          <React.Fragment key={i}>
            <mesh position={[x, -0.1, 0.42]}>
              <cylinderGeometry args={[0.042, 0.042, 1.32, 20]} />
              <meshPhysicalMaterial color="#161B18" metalness={0.9} roughness={0.25} clearcoat={0.6} />
            </mesh>
            <mesh position={[x, -0.1, -0.42]}>
              <cylinderGeometry args={[0.042, 0.042, 1.32, 20]} />
              <meshPhysicalMaterial color="#161B18" metalness={0.9} roughness={0.25} clearcoat={0.6} />
            </mesh>
          </React.Fragment>
        ))}
      </group>

      {/* 170F 7.5 HP Petrol Powerhead Unit (Rear Position) */}
      <group position={[0, -0.1, -0.3]}>
        <mesh>
          <boxGeometry args={[0.76, 0.65, 0.55]} />
          <meshPhysicalMaterial color="#7A878B" metalness={0.88} roughness={0.28} />
        </mesh>
        {/* Red Fuel Tank on Top */}
        <mesh position={[0, 0.42, 0]}>
          <boxGeometry args={[0.72, 0.32, 0.52]} />
          <meshPhysicalMaterial color="#D64527" roughness={0.18} metalness={0.25} clearcoat={0.9} />
        </mesh>
      </group>

      {/* Internal High-Flow Semi-Open Impeller & Ceramic Water Seal */}
      <group position={[0, -0.22, 0.16]}>
        {/* Impeller Hub */}
        <group ref={impellerRef}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.26, 0.26, 0.04, 32]} />
            <meshPhysicalMaterial color="#C5A880" metalness={0.95} roughness={0.15} clearcoat={0.7} />
          </mesh>
          {/* 4 Curved Vanes */}
          {[0, 90, 180, 270].map((deg, i) => (
            <mesh key={i} rotation={[0, 0, (deg * Math.PI) / 180]} position={[0.12, 0, 0]}>
              <boxGeometry args={[0.16, 0.02, 0.05]} />
              <meshPhysicalMaterial color="#D4AF37" metalness={0.95} roughness={0.12} />
            </mesh>
          ))}
        </group>
        {/* 20mm Ceramic Mechanical Seal Ring */}
        <mesh position={[0, 0, -0.06]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.08, 0.14, 24]} />
          <meshPhysicalMaterial color="#FFFFFF" roughness={0.1} clearcoat={1.0} />
        </mesh>
      </group>

      {/* 3" Heavy-Duty Cast Aluminum Pump Volute (Exploded Lerp) */}
      <group ref={pumpCasingRef} position={[0, -0.22, 0.28]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.38, 0.42, 0.32, 36]} />
          <meshPhysicalMaterial 
            color="#9AA6A9" 
            metalness={0.88} 
            roughness={0.24} 
            clearcoat={0.5} 
            transmission={0.2} 
            thickness={0.1}
          />
        </mesh>

        {/* 3" (80mm) Vertical Discharge Port with Aluminium Flange */}
        <group position={[0, 0.38, 0]}>
          <mesh>
            <cylinderGeometry args={[0.14, 0.14, 0.28, 28]} />
            <meshPhysicalMaterial color="#D2DADB" metalness={0.92} roughness={0.18} />
          </mesh>
          {/* Threaded Hose Collar */}
          <mesh position={[0, 0.14, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.06, 28]} />
            <meshPhysicalMaterial color="#D4AF37" metalness={0.95} roughness={0.15} />
          </mesh>
        </group>

        {/* 3" (80mm) Horizontal Suction Intake Neck */}
        <group position={[0, 0, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.14, 0.14, 0.24, 28]} />
            <meshPhysicalMaterial color="#D2DADB" metalness={0.92} roughness={0.18} />
          </mesh>
        </group>
      </group>

      {/* Real-time Water Flow Stream Animation when Running */}
      {isRunning && (
        <group position={[0, 0.58, 0.28]}>
          <Sparkles count={45} scale={[0.4, 0.8, 0.4]} size={3.5} speed={1.8} color="#38BDF8" opacity={0.85} />
        </group>
      )}

      {/* 3D Hotspot Pins */}
      <Html position={[0, 0.32, 0.36]} center>
        <button
          onClick={() => onSelectHotspot('hotspot-water-volute')}
          className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md border text-[10px] font-mono font-bold transition-all shadow-lg ${
            activeHotspot === 'hotspot-water-volute'
              ? 'bg-[#A6C96A] text-[#102C22] border-[#A6C96A] scale-110'
              : 'bg-[#141A17]/80 text-[#F7F5F0] border-[#A6C96A]/40 hover:scale-105'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
          <span>3&quot; High-Discharge</span>
        </button>
      </Html>
    </group>
  );
}

// ==========================================
// 4. Agroveer Cordless Bag Closer Model
// ==========================================
function CordlessBagCloserModel({ 
  isExploded, 
  isRunning, 
  activeHotspot, 
  onSelectHotspot 
}: { 
  isExploded: boolean; 
  isRunning: boolean;
  activeHotspot: string | null; 
  onSelectHotspot: (id: string) => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const needleRef = useRef<THREE.Group>(null!);
  const batteryRef = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const explodeT = isExploded ? 1 : 0;

    // Gentle machine sway
    if (groupRef.current) {
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0.05, 0.1);
    }

    // High-speed reciprocating stitching needle motion in real time
    if (needleRef.current && isRunning) {
      needleRef.current.position.y = Math.sin(t * 22) * 0.065;
    }

    // Exploded View: Slide-on 36V battery detaches downward
    if (batteryRef.current) {
      batteryRef.current.position.y = THREE.MathUtils.lerp(batteryRef.current.position.y, -0.45 - explodeT * 0.35, 0.08);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.05, 0]}>
      {/* Main Die-Cast Aluminum Sewing Housing */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.82, 0.44, 0.38]} />
        <meshPhysicalMaterial color="#94A0A4" metalness={0.9} roughness={0.24} clearcoat={0.5} />
      </mesh>

      {/* Ergonomic Molded Carry Handle */}
      <mesh position={[0, 0.32, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.045, 0.045, 0.72, 20]} />
        <meshPhysicalMaterial color="#D64527" roughness={0.22} clearcoat={0.8} />
      </mesh>

      {/* Reciprocating Needle Bar & High-Speed Presser Foot */}
      <group ref={needleRef} position={[-0.42, -0.15, 0]}>
        <mesh>
          <cylinderGeometry args={[0.012, 0.012, 0.22, 16]} />
          <meshPhysicalMaterial color="#E8ECEE" metalness={0.98} roughness={0.1} />
        </mesh>
        {/* Steel Presser Foot */}
        <mesh position={[0, -0.12, 0.04]}>
          <boxGeometry args={[0.08, 0.015, 0.12]} />
          <meshPhysicalMaterial color="#4A5257" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Thread Spool Stand & Cone */}
      <group position={[0.26, 0.38, 0]}>
        <mesh>
          <cylinderGeometry args={[0.07, 0.11, 0.26, 24]} />
          <meshPhysicalMaterial color="#FFFFFF" roughness={0.85} />
        </mesh>
      </group>

      {/* Detachable 36V Lithium-Ion Slide-on Battery Pack */}
      <group ref={batteryRef} position={[0, -0.45, 0]}>
        <mesh>
          <boxGeometry args={[0.55, 0.24, 0.32]} />
          <meshPhysicalMaterial color="#181D1A" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Active Power Indicator Green LEDs */}
        {[-0.08, 0, 0.08].map((x, i) => (
          <mesh key={i} position={[x, 0, 0.165]}>
            <sphereGeometry args={[0.012, 12, 12]} />
            <meshBasicMaterial color="#25D366" />
          </mesh>
        ))}
      </group>

      {/* 3D Hotspot Pins */}
      <Html position={[0, -0.42, 0.22]} center>
        <button
          onClick={() => onSelectHotspot('hotspot-dual-battery')}
          className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md border text-[10px] font-mono font-bold transition-all shadow-lg ${
            activeHotspot === 'hotspot-dual-battery'
              ? 'bg-[#A6C96A] text-[#102C22] border-[#A6C96A] scale-110'
              : 'bg-[#141A17]/80 text-[#F7F5F0] border-[#A6C96A]/40 hover:scale-105'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
          <span>36V Li-Ion Battery</span>
        </button>
      </Html>
    </group>
  );
}

// ==========================================
// 5. Sawking Super Gold Chainsaw Chain Model
// ==========================================
function SawkingChainGoldModel({ 
  isExploded, 
  isRunning, 
  activeHotspot, 
  onSelectHotspot 
}: { 
  isExploded: boolean; 
  isRunning: boolean;
  activeHotspot: string | null; 
  onSelectHotspot: (id: string) => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const chainTrackRef = useRef<THREE.Group>(null!);

  // 24 Chain cutter links arranged on an elliptical perimeter track
  const linkCount = 26;
  const rx = 1.1; // Track width
  const ry = 0.52; // Track height

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const explodeT = isExploded ? 1 : 0;

    if (groupRef.current) {
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.1);
    }

    // Real-time continuous circulation of the chain track along the bar
    if (chainTrackRef.current && isRunning) {
      chainTrackRef.current.rotation.z += delta * 1.8;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 22" Laser-Hardened Guide Bar Profile */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.9, 0.72, 0.04]} />
        <meshPhysicalMaterial color="#30383D" metalness={0.92} roughness={0.22} clearcoat={0.7} />
      </mesh>
      {/* Guide Bar Rail Groove Rim */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.94, 0.76, 0.015]} />
        <meshPhysicalMaterial color="#141719" metalness={0.98} roughness={0.15} />
      </mesh>

      {/* Continuously Circulating Sawking Chain Track */}
      <group ref={chainTrackRef} position={[0, 0, 0]}>
        {Array.from({ length: linkCount }).map((_, idx) => {
          const angle = (idx / linkCount) * Math.PI * 2;
          const x = Math.cos(angle) * rx;
          const y = Math.sin(angle) * ry;
          const rotZ = angle + Math.PI / 2;

          return (
            <group key={idx} position={[x, y, 0]} rotation={[0, 0, rotZ]}>
              {/* Blue Heat-Tempered Tie Straps */}
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.07, 0.025, 0.03]} />
                <meshPhysicalMaterial color="#1E4582" metalness={0.95} roughness={0.18} />
              </mesh>
              {/* Titanium Nitride (TiN) Gold Full-Chisel Cutter Tooth */}
              <mesh position={[0, 0.035, 0]}>
                <boxGeometry args={[0.05, 0.04, 0.05]} />
                <meshPhysicalMaterial 
                  color="#F0C446" 
                  metalness={0.98} 
                  roughness={0.1} 
                  clearcoat={0.95} 
                  clearcoatRoughness={0.1} 
                />
              </mesh>
              {/* Hardened Center Rivet Pin */}
              <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.008, 0.008, 0.045, 12]} />
                <meshPhysicalMaterial color="#E8EEF0" metalness={1.0} roughness={0.1} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Clear Presentation Case Floating Behind */}
      <mesh position={[0, 0, -0.32]} rotation={[0.08, 0.15, 0]}>
        <boxGeometry args={[1.45, 0.85, 0.16]} />
        <meshPhysicalMaterial 
          color="#F8F6EF" 
          roughness={0.12} 
          transmission={0.7} 
          thickness={0.3} 
          transparent 
          opacity={0.88} 
        />
      </mesh>
      {/* Blue Clasp */}
      <mesh position={[-0.75, 0, -0.32]} rotation={[0.08, 0.15, 0]}>
        <boxGeometry args={[0.06, 0.22, 0.18]} />
        <meshPhysicalMaterial color="#1A5FB4" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* 3D Hotspot Pins */}
      <Html position={[0.7, 0.35, 0.1]} center>
        <button
          onClick={() => onSelectHotspot('hotspot-tin-coat')}
          className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md border text-[10px] font-mono font-bold transition-all shadow-lg ${
            activeHotspot === 'hotspot-tin-coat'
              ? 'bg-[#A6C96A] text-[#102C22] border-[#A6C96A] scale-110'
              : 'bg-[#141A17]/80 text-[#F7F5F0] border-[#A6C96A]/40 hover:scale-105'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
          <span>TiN Gold Cutters</span>
        </button>
      </Html>
    </group>
  );
}

// ==========================================
// Main Inspection Scene Container
// ==========================================
export const MachineryInspectionScene = ({ 
  machineType = 'engine-170f',
  activeHotspot,
  onSelectHotspot
}: { 
  machineType: InspectableMachineType;
  activeHotspot: string | null;
  onSelectHotspot: (id: string) => void;
}) => {
  const [autoRotate, setAutoRotate] = useState(true);
  const [isRunning, setIsRunning] = useState(true);
  const [isExploded, setIsExploded] = useState(false);

  return (
    <div className="relative w-full h-[340px] xs:h-[400px] sm:h-[500px] lg:h-[620px] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#102C22] border border-[rgba(166,201,106,0.2)] shadow-2xl flex items-center justify-center">
      
      {/* 3D WebGL Canvas */}
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.3, 4.0], fov: 36 }}
        gl={{ 
          antialias: true, 
          alpha: true, 
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15
        }}
      >
        {/* Studio Ambient & Directional Key Light */}
        <ambientLight intensity={0.95} color="#E9E1CC" />
        
        <directionalLight
          position={[6, 8, 6]}
          intensity={2.8}
          color="#FFFDF7"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Specular Rim Light (Fresh Leaf Lime Accent) */}
        <pointLight position={[-4, 3, -3]} intensity={3.0} color="#A6C96A" />

        {/* Soft Cool Fill Light */}
        <directionalLight position={[-4, -1, 3]} intensity={1.4} color="#8F9CA3" />

        {/* Undercarriage Warm Bounce Light */}
        <pointLight position={[0, -2, 2]} intensity={1.0} color="#D4AF37" />

        {/* Floating Atmospheric Workshop Micro-Sparks */}
        <Sparkles count={35} scale={4.5} size={2.0} speed={0.4} color="#A6C96A" opacity={0.35} />

        {/* Machinery Models */}
        <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.15}>
          {machineType === 'engine-170f' && (
            <Engine170FModel 
              isExploded={isExploded} 
              isRunning={isRunning} 
              activeHotspot={activeHotspot} 
              onSelectHotspot={onSelectHotspot} 
            />
          )}
          {machineType === 'earth-auger-ea85' && (
            <EarthAugerEA85Model 
              isExploded={isExploded} 
              isRunning={isRunning} 
              activeHotspot={activeHotspot} 
              onSelectHotspot={onSelectHotspot} 
            />
          )}
          {machineType === 'water-pump-wp30' && (
            <WaterPumpWP30Model 
              isExploded={isExploded} 
              isRunning={isRunning} 
              activeHotspot={activeHotspot} 
              onSelectHotspot={onSelectHotspot} 
            />
          )}
          {machineType === 'cordless-bag-closer' && (
            <CordlessBagCloserModel 
              isExploded={isExploded} 
              isRunning={isRunning} 
              activeHotspot={activeHotspot} 
              onSelectHotspot={onSelectHotspot} 
            />
          )}
          {machineType === 'sawking-chain-gold' && (
            <SawkingChainGoldModel 
              isExploded={isExploded} 
              isRunning={isRunning} 
              activeHotspot={activeHotspot} 
              onSelectHotspot={onSelectHotspot} 
            />
          )}
        </Float>

        {/* Soft Realistic Contact Shadow on Ground */}
        <ContactShadows
          position={[0, -1.02, 0]}
          opacity={0.8}
          scale={5.5}
          blur={2.2}
          far={3.8}
          color="#05100B"
        />

        {/* Silky-Smooth Inertial OrbitControls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping={true}
          dampingFactor={0.04}
          rotateSpeed={0.8}
          autoRotate={autoRotate}
          autoRotateSpeed={1.2}
          minPolarAngle={Math.PI / 2.6}
          maxPolarAngle={Math.PI / 1.7}
        />
      </Canvas>

      {/* Floating HUD Controls Bar - Intelligently Adaptive */}
      <div className="absolute top-2.5 sm:top-4 left-2.5 sm:left-4 right-2.5 sm:right-4 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 pointer-events-auto z-20">
        <div className="flex items-center gap-1.5 sm:gap-2 bg-[#141A17]/85 backdrop-blur-md px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-[rgba(166,201,106,0.25)] text-[9px] sm:text-[11px] text-[#F7F5F0]">
          <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isRunning ? 'bg-[#A6C96A] animate-pulse' : 'bg-amber-400'}`} />
          <span className="font-mono">{isRunning ? 'Real-Time RPM: Active' : 'Real-Time: Paused'}</span>
        </div>

        {/* Mode Toggles */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-mono font-bold transition-all border shadow-sm ${
              isRunning
                ? 'bg-[#24583D] text-[#F7F5F0] border-[#A6C96A]'
                : 'bg-[#141A17]/80 text-[#F7F5F0]/70 border-white/10 hover:text-white'
            }`}
          >
            {isRunning ? 'Pause Kinetics' : 'Run Kinetics'}
          </button>

          <button
            onClick={() => setIsExploded(!isExploded)}
            className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-mono font-bold transition-all border shadow-sm ${
              isExploded
                ? 'bg-[#D64527] text-white border-white/30 scale-105'
                : 'bg-[#141A17]/80 text-[#F7F5F0]/70 border-white/10 hover:text-white'
            }`}
          >
            {isExploded ? 'Assembled' : 'Exploded View'}
          </button>
        </div>
      </div>

      {/* Bottom Floating Bar */}
      <div className="absolute bottom-2.5 sm:bottom-4 left-2.5 sm:left-4 right-2.5 sm:right-4 flex items-center justify-between pointer-events-auto z-20">
        <span className="text-[9px] sm:text-[10px] font-mono text-[#F7F5F0]/60 hidden sm:inline-block">
          Click &amp; Drag to Orbit • Click Hotspot Pins to Inspect
        </span>

        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className="bg-[#141A17]/85 hover:bg-[#1A2420] backdrop-blur-md px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-white/15 text-[9px] sm:text-[10px] font-mono text-[#F7F5F0] hover:text-[#A6C96A] transition-colors ml-auto shadow-sm"
        >
          {autoRotate ? 'Pause 360° Orbit' : 'Resume 360° Orbit'}
        </button>
      </div>

    </div>
  );
};
