import { Canvas } from '@react-three/fiber'
import { Environment, Grid, OrbitControls, SoftShadows } from '@react-three/drei'
import { useEffect, useMemo, useState } from 'react'
import Floor from './Floor'
import type { SurfaceTextureSet } from './Floor'
import Wall from './Wall'
import './FloorPlanDesigner.css'

export interface WallData {
  id: string
  start: [number, number]
  end: [number, number]
  height?: number
  thickness?: number
}

interface TextureFormState {
  color: string
  normal: string
  roughness: string
}

interface StylePack {
  name: string
  keywords: string[]
  environment: 'city' | 'sunset' | 'dawn' | 'forest' | 'warehouse'
  baseSize: [number, number]
  wallHeight: number
  thickness: number
  floor: TextureFormState
  wall: TextureFormState
}

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const stylePacks: StylePack[] = [
  {
    name: 'Modern Loft',
    keywords: ['modern', 'loft', 'industrial'],
    environment: 'city',
    baseSize: [18, 12],
    wallHeight: 3.4,
    thickness: 0.22,
    floor: {
      color:
        'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/hardwood2_diffuse.jpg',
      normal: '',
      roughness: '',
    },
    wall: {
      color:
        'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/brick_diffuse.jpg',
      normal: '',
      roughness: '',
    },
  },
  {
    name: 'Coastal Calm',
    keywords: ['coastal', 'beach', 'seaside'],
    environment: 'dawn',
    baseSize: [16, 11],
    wallHeight: 3,
    thickness: 0.2,
    floor: {
      color:
        'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/terrain/grasslight-big.jpg',
      normal: '',
      roughness: '',
    },
    wall: {
      color:
        'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/uv_grid_opengl.jpg',
      normal: '',
      roughness: '',
    },
  },
  {
    name: 'Rustic Cabin',
    keywords: ['rustic', 'cabin', 'mountain', 'cottage'],
    environment: 'forest',
    baseSize: [14, 10],
    wallHeight: 2.8,
    thickness: 0.24,
    floor: {
      color:
        'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/hardwood2_diffuse.jpg',
      normal: '',
      roughness: '',
    },
    wall: {
      color:
        'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/brick_diffuse.jpg',
      normal: '',
      roughness: '',
    },
  },
  {
    name: 'Gallery Minimal',
    keywords: ['minimal', 'gallery', 'studio', 'japanese'],
    environment: 'warehouse',
    baseSize: [15, 12],
    wallHeight: 3.2,
    thickness: 0.18,
    floor: {
      color:
        'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/uv_grid_opengl.jpg',
      normal: '',
      roughness: '',
    },
    wall: {
      color:
        'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/uv_grid_opengl.jpg',
      normal: '',
      roughness: '',
    },
  },
]

const surprisePrompts = [
  'modern loft with two bedrooms and a long hallway',
  'coastal open plan with an L-shaped kitchen wing',
  'rustic cabin with three rooms and a short corridor',
  'minimal studio apartment, open layout',
  'gallery-style home with split rooms and central hall',
]

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min)

const buildRectangleWalls = (
  centerX: number,
  centerZ: number,
  width: number,
  depth: number,
  height: number,
  thickness: number,
): WallData[] => {
  const halfW = width / 2
  const halfD = depth / 2

  return [
    {
      id: createId(),
      start: [centerX - halfW, centerZ - halfD],
      end: [centerX + halfW, centerZ - halfD],
      height,
      thickness,
    },
    {
      id: createId(),
      start: [centerX + halfW, centerZ - halfD],
      end: [centerX + halfW, centerZ + halfD],
      height,
      thickness,
    },
    {
      id: createId(),
      start: [centerX + halfW, centerZ + halfD],
      end: [centerX - halfW, centerZ + halfD],
      height,
      thickness,
    },
    {
      id: createId(),
      start: [centerX - halfW, centerZ + halfD],
      end: [centerX - halfW, centerZ - halfD],
      height,
      thickness,
    },
  ]
}

const getRoomCount = (prompt: string) => {
  if (prompt.includes('studio') || prompt.includes('open')) {
    return 1
  }
  if (prompt.match(/\bthree\b|\b3\b/)) {
    return 3
  }
  if (prompt.match(/\btwo\b|\b2\b/)) {
    return 2
  }
  return 1
}

const pickStylePack = (prompt: string) => {
  const normalized = prompt.toLowerCase()
  return (
    stylePacks.find((pack) => pack.keywords.some((keyword) => normalized.includes(keyword))) ||
    stylePacks[0]
  )
}

function FloorPlanDesigner() {
  const [prompt, setPrompt] = useState('modern loft with two bedrooms and a hallway')
  const [styleName, setStyleName] = useState(stylePacks[0].name)
  const [walls, setWalls] = useState<WallData[]>([])
  const [floorTextures, setFloorTextures] = useState<TextureFormState>(stylePacks[0].floor)
  const [wallTextures, setWallTextures] = useState<TextureFormState>(stylePacks[0].wall)
  const [environmentPreset, setEnvironmentPreset] = useState<StylePack['environment']>(
    stylePacks[0].environment,
  )
  const [floorSize, setFloorSize] = useState(50)

  const floorTextureSet = useMemo<SurfaceTextureSet>(() => {
    return {
      color: floorTextures.color.trim() || undefined,
      normal: floorTextures.normal.trim() || undefined,
      roughness: floorTextures.roughness.trim() || undefined,
    }
  }, [floorTextures])

  const wallTextureSet = useMemo<SurfaceTextureSet>(() => {
    return {
      color: wallTextures.color.trim() || undefined,
      normal: wallTextures.normal.trim() || undefined,
      roughness: wallTextures.roughness.trim() || undefined,
    }
  }, [wallTextures])

  const generateFromPrompt = (rawPrompt: string) => {
    const normalizedPrompt = rawPrompt.trim().toLowerCase()
    const style = pickStylePack(normalizedPrompt)
    const roomCount = getRoomCount(normalizedPrompt)
    const includesLShape = normalizedPrompt.includes('l-shaped') || normalizedPrompt.includes('l shape')
    const includesHallway = normalizedPrompt.includes('hallway') || normalizedPrompt.includes('corridor')
    const openLayout = normalizedPrompt.includes('open') || normalizedPrompt.includes('studio')

    const width = style.baseSize[0] + randomBetween(-3, 3)
    const depth = style.baseSize[1] + randomBetween(-2.5, 2.5)
    const height = style.wallHeight
    const thickness = style.thickness

    let nextWalls = buildRectangleWalls(0, 0, width, depth, height, thickness)

    if (includesLShape) {
      const wingWidth = width * 0.55
      const wingDepth = depth * 0.5
      const wingOffsetX = width * 0.2
      const wingOffsetZ = depth * 0.2
      nextWalls = nextWalls.concat(
        buildRectangleWalls(wingOffsetX, wingOffsetZ, wingWidth, wingDepth, height, thickness),
      )
    }

    if (!openLayout) {
      if (roomCount >= 2) {
        nextWalls.push({
          id: createId(),
          start: [0, -depth / 2],
          end: [0, depth / 2],
          height,
          thickness,
        })
      }
      if (roomCount >= 3) {
        nextWalls.push({
          id: createId(),
          start: [-width / 2, 0],
          end: [width / 2, 0],
          height,
          thickness,
        })
      }
      if (includesHallway) {
        nextWalls.push({
          id: createId(),
          start: [-width * 0.1, -depth * 0.45],
          end: [width * 0.1, -depth * 0.45],
          height,
          thickness,
        })
      }
    }

    const paddedSize = Math.max(width, depth) + 20

    setStyleName(style.name)
    setFloorTextures(style.floor)
    setWallTextures(style.wall)
    setEnvironmentPreset(style.environment)
    setWalls(nextWalls)
    setFloorSize(paddedSize)
  }

  const handleGenerate = () => {
    generateFromPrompt(prompt)
  }

  const handleSurprise = () => {
    const promptIndex = Math.floor(Math.random() * surprisePrompts.length)
    const selectedPrompt = surprisePrompts[promptIndex]
    setPrompt(selectedPrompt)
    generateFromPrompt(selectedPrompt)
  }

  useEffect(() => {
    generateFromPrompt(prompt)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const normalizedFloorSize = Number.isFinite(floorSize) && floorSize > 10 ? floorSize : 50

  return (
    <div className="designer-container">
      <div className="controls-panel">
        <div className="panel-section">
          <h2>Prompted Floorplan</h2>
          <p className="section-subtitle">Describe a home style and layout. The scene updates instantly.</p>
          <textarea
            className="prompt-input"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Example: modern loft with two bedrooms and a long hallway"
          />
          <div className="button-row">
            <button onClick={handleGenerate}>Generate Plan</button>
            <button className="secondary" onClick={handleSurprise}>Surprise Me</button>
          </div>
        </div>

        <div className="panel-section">
          <h3>Style Readout</h3>
          <div className="info">
            <p>Style: {styleName}</p>
            <p>Walls: {walls.length}</p>
            <p>Environment: {environmentPreset}</p>
            <p>Drag in the 3D view to orbit. Scroll to zoom.</p>
          </div>
        </div>

        <div className="panel-section">
          <h3>Example Prompts</h3>
          <div className="prompt-list">
            {surprisePrompts.map((example) => (
              <button
                key={example}
                className="chip"
                onClick={() => {
                  setPrompt(example)
                  generateFromPrompt(example)
                }}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="canvas-container">
        <Canvas
          camera={{ position: [12, 10, 12], fov: 45 }}
          shadows
          dpr={[1, 2]}
        >
          <color attach="background" args={['#121418']} />
          <ambientLight intensity={0.45} />
          <directionalLight
            position={[10, 12, 6]}
            intensity={1.1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <directionalLight position={[-8, 6, -6]} intensity={0.4} />
          <SoftShadows size={20} samples={16} focus={0.5} />
          <Environment preset={environmentPreset} />
          <Floor size={normalizedFloorSize} texture={floorTextureSet} />
          {walls.map((wall) => (
            <Wall
              key={wall.id}
              start={wall.start}
              end={wall.end}
              height={wall.height}
              thickness={wall.thickness}
              texture={wallTextureSet}
            />
          ))}
          <Grid
            args={[normalizedFloorSize, normalizedFloorSize]}
            cellSize={1}
            cellThickness={0.5}
            cellColor="#6e6e6e"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#b07a4f"
            fadeDistance={normalizedFloorSize * 0.6}
            fadeStrength={1}
            infiniteGrid
          />
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={5}
            maxDistance={70}
          />
        </Canvas>
      </div>
    </div>
  )
}

export default FloorPlanDesigner
