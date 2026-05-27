import { useMemo, useRef } from 'react'
import { Mesh, Vector3 } from 'three'
import type { SurfaceTextureSet } from './Floor'
import { useRemoteTexture } from './useRemoteTexture'

interface WallProps {
  start: [number, number]
  end: [number, number]
  height?: number
  thickness?: number
  texture?: SurfaceTextureSet
}

function Wall({ start, end, height = 3, thickness = 0.2, texture }: WallProps) {
  const meshRef = useRef<Mesh>(null)

  // Calculate wall length and position
  const startVec = new Vector3(start[0], height / 2, start[1])
  const endVec = new Vector3(end[0], height / 2, end[1])
  const length = startVec.distanceTo(endVec)
  const midpoint = new Vector3().addVectors(startVec, endVec).multiplyScalar(0.5)
  
  // Calculate rotation
  const direction = new Vector3().subVectors(endVec, startVec).normalize()
  const angle = Math.atan2(direction.x, direction.z)
  const repeat = useMemo<[number, number]>(
    () => [Math.max(1, length / 2), Math.max(1, height / 2)],
    [length, height],
  )
  const colorMap = useRemoteTexture(texture?.color, { repeat, colorSpace: 'srgb' })
  const normalMap = useRemoteTexture(texture?.normal, { repeat })
  const roughnessMap = useRemoteTexture(texture?.roughness, { repeat })

  return (
    <mesh
      ref={meshRef}
      position={[midpoint.x, midpoint.y, midpoint.z]}
      rotation={[0, angle, 0]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[thickness, height, length]} />
      <meshStandardMaterial
        color={colorMap ? '#ffffff' : '#8b7355'}
        map={colorMap ?? undefined}
        normalMap={normalMap ?? undefined}
        roughnessMap={roughnessMap ?? undefined}
        roughness={colorMap ? 0.75 : 0.85}
        metalness={0.02}
      />
    </mesh>
  )
}

export default Wall
