import { useEffect, useMemo, useState } from 'react'
import { RepeatWrapping, SRGBColorSpace, Texture, TextureLoader } from 'three'
import { useThree } from '@react-three/fiber'

type ColorSpaceMode = 'srgb' | 'linear'

interface TextureOptions {
  repeat?: [number, number]
  colorSpace?: ColorSpaceMode
}

const getRepeatKey = (repeat?: [number, number]) => {
  if (!repeat) {
    return 'none'
  }
  return `${repeat[0]}:${repeat[1]}`
}

export function useRemoteTexture(url?: string, options?: TextureOptions) {
  const { gl } = useThree()
  const [texture, setTexture] = useState<Texture | null>(null)
  const repeatKey = useMemo(() => getRepeatKey(options?.repeat), [options?.repeat])

  useEffect(() => {
    if (!url) {
      setTexture(null)
      return
    }

    let cancelled = false
    const loader = new TextureLoader()
    loader.setCrossOrigin('anonymous')

    loader.load(
      url,
      (loaded) => {
        if (cancelled) {
          loaded.dispose()
          return
        }

        loaded.wrapS = RepeatWrapping
        loaded.wrapT = RepeatWrapping

        if (options?.repeat) {
          loaded.repeat.set(options.repeat[0], options.repeat[1])
        }

        if (options?.colorSpace === 'srgb') {
          loaded.colorSpace = SRGBColorSpace
        }

        loaded.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy())
        setTexture(loaded)
      },
      undefined,
      () => {
        if (!cancelled) {
          setTexture(null)
        }
      },
    )

    return () => {
      cancelled = true
    }
  }, [url, repeatKey, options?.colorSpace, gl])

  return texture
}
