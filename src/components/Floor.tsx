import { useMemo, useRef } from 'react'
import { Mesh } from 'three'
import { useRemoteTexture } from './useRemoteTexture'

export type SurfaceTextureSet = {
  color?: string
  normal?: string
  roughness?: string
}

interface FloorProps {
  size?: number
  texture?: SurfaceTextureSet
}

function Floor({ size = 50, texture }: FloorProps) {
  const meshRef = useRef<Mesh>(null)
  const repeat = useMemo<[number, number]>(() => [size / 6, size / 6], [size])
  const colorMap = useRemoteTexture(texture?.color, { repeat, colorSpace: 'srgb' })
  const normalMap = useRemoteTexture(texture?.normal, { repeat })
  const roughnessMap = useRemoteTexture(texture?.roughness, { repeat })

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial
        color={colorMap ? '#ffffff' : '#3a3a3a'}
        map={colorMap ?? undefined}
        normalMap={normalMap ?? undefined}
        roughnessMap={roughnessMap ?? undefined}
        roughness={colorMap ? 0.8 : 0.95}
        metalness={0.05}
      />
    </mesh>
  )
}

export default Floor
