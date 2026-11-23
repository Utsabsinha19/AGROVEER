'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Wind-animated Crops using high-performance InstancedMesh
function CropField({ count = 1200 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate randomized positions along rolling ground
  const stalks = useMemo(() => {
    const items = [];
    const width = 36;
    const depth = 28;

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * width;
      const z = -Math.random() * depth - 2; // In front of and receding from camera
      // Subtle ground undulation
      const y = Math.sin(x * 0.2) * 0.4 + Math.cos(z * 0.15) * 0.3 - 1.2;
      const scale = 0.8 + Math.random() * 0.6;
      const rotY = Math.random() * Math.PI * 2;
      const swayOffset = Math.random() * 10;
      items.push({ x, y, z, scale, rotY, swayOffset });
    }
    return items;
  }, [count]);

  // Initial matrix setup
  useEffect(() => {
    if (!meshRef.current) return;
    stalks.forEach((stalk, i) => {
      dummy.position.set(stalk.x, stalk.y, stalk.z);
      dummy.rotation.set(0, stalk.rotY, 0);
      dummy.scale.set(stalk.scale, stalk.scale, stalk.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [stalks, dummy]);

  // Wind sway animation in frame loop
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * 1.8;

    stalks.forEach((stalk, i) => {
      // Wind wave traveling across the field
      const wind = Math.sin(t + stalk.x * 0.35 + stalk.z * 0.25) * 0.12;
      const gust = Math.cos(t * 0.7 + stalk.swayOffset) * 0.06;

      dummy.position.set(stalk.x, stalk.y, stalk.z);
      // Gentle natural bending
      dummy.rotation.set(wind + gust, stalk.rotY + wind * 0.3, wind * 0.6);
      dummy.scale.set(stalk.scale, stalk.scale, stalk.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  // Geometry: Stalk + Wheat / Leaf cluster
  const geometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.015, 0.035, 2.2, 5);
    geo.translate(0, 1.1, 0); // Pivot at base
    return geo;
  }, []);

  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, count]} castShadow receiveShadow>
      <meshStandardMaterial
        color="#7DA340"
        roughness={0.65}
        metalness={0.1}
        wireframe={false}
      />
    </instancedMesh>
  );
}

// Atmospheric Golden Pollen & Micro-Spore Particles
function PollenParticles({ count = 350 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null!);

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = Math.random() * 8 - 1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 25 - 5;

      vel[i * 3] = (Math.random() - 0.5) * 0.008;
      vel[i * 3 + 1] = Math.random() * 0.006 + 0.002; // Upward drift
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.008;
    }
    return { positions: pos, velocities: vel };
  }, [count]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      posArray[i * 3 + 1] += velocities[i * 3 + 1];
      posArray[i * 3] += Math.sin(posArray[i * 3 + 1] * 2) * 0.005;

      // Loop particles if they float too high
      if (posArray[i * 3 + 1] > 8) {
        posArray[i * 3 + 1] = -1;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        color="#FDE68A"
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Rolling Landscape Terrain
function Terrain() {
  const terrainGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(60, 50, 48, 48);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Gentle natural landscape waves
      const z = Math.sin(x * 0.15) * 0.7 + Math.cos(y * 0.12) * 0.8;
      pos.setZ(i, z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh
      geometry={terrainGeo}
      rotation={[-Math.PI / 2.1, 0, 0]}
      position={[0, -1.8, -12]}
      receiveShadow
    >
      <meshStandardMaterial
        color="#153628"
        roughness={0.9}
        metalness={0.05}
        flatShading={false}
      />
    </mesh>
  );
}

// Golden Sun Disk & Horizon Glow
function GoldenSun() {
  return (
    <group position={[8, 3.5, -28]}>
      {/* Sun Core */}
      <mesh>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial color="#FFE4A0" />
      </mesh>
      {/* Sun Aura Glow */}
      <mesh>
        <sphereGeometry args={[4.2, 32, 32]} />
        <meshBasicMaterial
          color="#FFAE42"
          transparent
          opacity={0.35}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// Interactive Camera Rig with Smooth Pointer Parallax and Scroll Offset
function CameraController() {
  const targetCam = useRef({ x: 0, y: 1.8, z: 6, rotX: 0, rotY: 0 });

  useFrame(({ camera, pointer }) => {
    // Parallax damping
    targetCam.current.x = pointer.x * 1.2;
    targetCam.current.y = 1.8 + pointer.y * 0.6;
    targetCam.current.rotY = -pointer.x * 0.08;
    targetCam.current.rotX = pointer.y * 0.05;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCam.current.x, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCam.current.y, 0.04);
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, targetCam.current.rotY, 0.04);
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetCam.current.rotX, 0.04);
  });

  return null;
}

export const HeroScene = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 1.8, 6], fov: 48, near: 0.1, far: 80 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true,
        }}
      >
        <color attach="background" args={['#0c221a']} />
        <fogExp2 attach="fog" args={['#0e271e', 0.035]} />

        {/* Ambient & Cinematic Lighting */}
        <ambientLight intensity={0.8} color="#A6C96A" />
        <directionalLight
          position={[10, 12, -15]}
          intensity={2.8}
          color="#FFE7BA"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        {/* Soft front botanical fill light */}
        <directionalLight position={[-8, 6, 8]} intensity={0.9} color="#7DA340" />

        <CameraController />
        <GoldenSun />
        <Terrain />
        <CropField count={1400} />
        <PollenParticles count={350} />
      </Canvas>
    </div>
  );
};

