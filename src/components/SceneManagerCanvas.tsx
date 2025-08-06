import { SheetProvider } from '@theatre/r3f'
import { type IProject, type ISheet } from '@theatre/core'
import { lazy, Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { useSpring, config } from '@react-spring/web'
import { useScrollStore } from '../store'

interface SceneManagerCanvasProps {
  duration: number
  sheetProviderKey: string
  sheet: ISheet
  componentImportPath: string
  gl?: {
    preserveDrawingBuffer?: boolean
    antialias?: boolean
    toneMapping?: any
  }
}

const SceneManagerCanvas: React.FC<SceneManagerCanvasProps> = ({
  duration,
  sheetProviderKey,
  sheet,
  componentImportPath,
  gl = {
    preserveDrawingBuffer: true,
    antialias: false,
  },
}) => {
  const LazyComponent = lazy(
    () => import(/* @vite-ignore */ componentImportPath)
  )
  const scrollRatioRef = useRef(useScrollStore.getState().scrollRatio)
  // const storyId = 'test'
  const [, apiTheatre] = useSpring(() => ({
    position: 0,
    config: config.molasses,
    onChange: ({ value }) => {
      if (!sheet) return
      sheet.sequence.position = value.position
    },
  }))

  useEffect(() => {
    apiTheatre.set({
      position: 0,
    })
    return useScrollStore.subscribe((state) => {
      scrollRatioRef.current = state.scrollRatio
      apiTheatre.start({
        position: scrollRatioRef.current * duration,
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, sheetProviderKey])

  return (
    <div className='fixed top-0 left-0 h-screen w-screen bg-gray-100 z-0'>
      <Canvas
        shadows
        gl={gl}
        camera={{
          position: [5, -5, 0],
          fov: 75,
        }}
      >
        <SheetProvider key={sheetProviderKey} sheet={sheet}>
          <Suspense fallback={null}>
            <LazyComponent />
          </Suspense>
        </SheetProvider>
      </Canvas>
    </div>
  )
}

export default SceneManagerCanvas
