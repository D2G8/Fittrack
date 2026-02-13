"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { useMemo } from "react"
import * as THREE from "three"

interface BodyModelProps {
  activeBodyParts: string[]
}

function BodyPart({
  position,
  scale,
  isActive,
  shape = "sphere",
}: {
  position: [number, number, number]
  scale: [number, number, number]
  isActive: boolean
  shape?: "sphere" | "box" | "cylinder"
}) {
  const color = isActive ? "#3b82f6" : "#94a3b8"
  const emissiveIntensity = isActive ? 0.8 : 0

  return (
    <mesh position={position} scale={scale}>
      {shape === "sphere" && <sphereGeometry args={[1, 24, 24]} />}
      {shape === "box" && <boxGeometry args={[1, 1, 1]} />}
      {shape === "cylinder" && <cylinderGeometry args={[0.5, 0.5, 1, 16]} />}
      <meshStandardMaterial
        color={color}
        emissive={isActive ? "#3b82f6" : "#000000"}
        emissiveIntensity={emissiveIntensity}
        roughness={0.4}
        metalness={0.1}
      />
    </mesh>
  )
}

function GlowRing({ position, isActive }: { position: [number, number, number]; isActive: boolean }) {
  if (!isActive) return null
  return (
    <mesh position={position} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.8, 0.02, 8, 32]} />
      <meshBasicMaterial color="#60a5fa" transparent opacity={0.6} />
    </mesh>
  )
}

function HumanBody({ activeBodyParts }: { activeBodyParts: string[] }) {
  const isActive = (part: string) => activeBodyParts.includes(part)

  return (
    <group>
      {/* Head */}
      <BodyPart position={[0, 2.8, 0]} scale={[0.35, 0.4, 0.35]} isActive={false} shape="sphere" />
      {/* Neck */}
      <BodyPart position={[0, 2.35, 0]} scale={[0.15, 0.2, 0.15]} isActive={false} shape="cylinder" />

      {/* Chest */}
      <BodyPart position={[0, 1.7, 0]} scale={[0.65, 0.55, 0.35]} isActive={isActive("chest")} shape="box" />
      <GlowRing position={[0, 1.7, 0]} isActive={isActive("chest")} />

      {/* Shoulders */}
      <BodyPart position={[-0.55, 2.0, 0]} scale={[0.25, 0.2, 0.25]} isActive={isActive("shoulders")} shape="sphere" />
      <BodyPart position={[0.55, 2.0, 0]} scale={[0.25, 0.2, 0.25]} isActive={isActive("shoulders")} shape="sphere" />

      {/* Core / Abs */}
      <BodyPart position={[0, 1.0, 0]} scale={[0.55, 0.5, 0.3]} isActive={isActive("core")} shape="box" />

      {/* Back - slightly behind torso */}
      <BodyPart position={[0, 1.4, -0.2]} scale={[0.6, 0.8, 0.15]} isActive={isActive("back")} shape="box" />
      <GlowRing position={[0, 1.4, -0.2]} isActive={isActive("back")} />

      {/* Arms */}
      <BodyPart position={[-0.75, 1.5, 0]} scale={[0.14, 0.55, 0.14]} isActive={isActive("arms")} shape="cylinder" />
      <BodyPart position={[0.75, 1.5, 0]} scale={[0.14, 0.55, 0.14]} isActive={isActive("arms")} shape="cylinder" />
      {/* Forearms */}
      <BodyPart position={[-0.75, 0.85, 0]} scale={[0.12, 0.45, 0.12]} isActive={isActive("arms")} shape="cylinder" />
      <BodyPart position={[0.75, 0.85, 0]} scale={[0.12, 0.45, 0.12]} isActive={isActive("arms")} shape="cylinder" />

      {/* Legs */}
      <BodyPart position={[-0.22, 0.05, 0]} scale={[0.2, 0.7, 0.2]} isActive={isActive("legs")} shape="cylinder" />
      <BodyPart position={[0.22, 0.05, 0]} scale={[0.2, 0.7, 0.2]} isActive={isActive("legs")} shape="cylinder" />
      <GlowRing position={[-0.22, 0.05, 0]} isActive={isActive("legs")} />
      <GlowRing position={[0.22, 0.05, 0]} isActive={isActive("legs")} />

      {/* Calves */}
      <BodyPart position={[-0.22, -0.8, 0]} scale={[0.16, 0.55, 0.16]} isActive={isActive("legs")} shape="cylinder" />
      <BodyPart position={[0.22, -0.8, 0]} scale={[0.16, 0.55, 0.16]} isActive={isActive("legs")} shape="cylinder" />

      {/* Floor reference */}
      <mesh position={[0, -1.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshStandardMaterial color="#1e293b" transparent opacity={0.15} />
      </mesh>
    </group>
  )
}

export function BodyModel({ activeBodyParts }: BodyModelProps) {
  return (
    <div className="h-[320px] w-full rounded-2xl border border-exercise-primary/20 bg-gradient-to-b from-exercise-accent to-exercise-bg overflow-hidden">
      <Canvas camera={{ position: [0, 1, 5], fov: 40 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-3, 3, 3]} intensity={0.5} color="#3b82f6" />
        <HumanBody activeBodyParts={activeBodyParts} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate
          autoRotateSpeed={1}
        />
        <Environment preset="studio" />
      </Canvas>
      {activeBodyParts.length > 0 && (
        <div className="flex items-center justify-center gap-2 pb-3 -mt-10 relative z-10">
          {activeBodyParts.map((part) => (
            <span
              key={part}
              className="rounded-full bg-exercise-primary px-3 py-1 text-xs font-medium text-exercise-primary-foreground capitalize"
            >
              {part}
            </span>
          ))}
        </div>
      )}
      {activeBodyParts.length === 0 && (
        <p className="text-center text-sm text-exercise-muted pb-3 -mt-8 relative z-10">
          No workout scheduled for today
        </p>
      )}
    </div>
  )
}
