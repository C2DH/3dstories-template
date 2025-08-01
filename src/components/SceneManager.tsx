import { SheetProvider } from '@theatre/r3f'
import studio from '@theatre/studio'
import extension from '@theatre/r3f/dist/extension'
import { getProject } from '@theatre/core'
import { lazy, Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { useSpring, config } from '@react-spring/web'
import { useScrollStore } from '../store'

if (import.meta.env.MODE === 'development') {
  studio.initialize()
  studio.extend(extension)
}

const availableSceneComponents = Object.keys(
  import.meta.glob('./scenes/*.tsx')
).reduce(
  (acc, path) => {
    const componentPath = path.replace('./scenes/', '')
    if (componentPath) {
      acc[componentPath] = path
    }
    return acc
  },
  {} as Record<string, string>
)

interface SceneManagerProps {
  duration: number
  projectName: string
  sheetName: string
  // e.g., './MyComponent.tsx'
  componentPath: string
  gl?: {
    preserveDrawingBuffer?: boolean
    antialias?: boolean
    toneMapping?: any
  }
}

const SceneManager: React.FC<SceneManagerProps> = ({
  duration,
  projectName,
  sheetName,
  componentPath,
  gl = {
    preserveDrawingBuffer: true,
    antialias: false,
  },
}: SceneManagerProps) => {
  if (!availableSceneComponents[componentPath]) {
    console.error(
      `[SceneManager] Component path "${componentPath}" not found in available src/components/scenes fodler. Available components: ${Object.keys(
        availableSceneComponents
      ).join(', ')}`
    )
    return null
  }
  useEffect(() => {
    if (import.meta.env.MODE === 'development') {
      studio.initialize()
      studio.extend(extension)
    }
  }, [])
  const LazyComponent = lazy(
    () => import(/* @vite-ignore */ availableSceneComponents[componentPath])
  )

  const scrollRatioRef = useRef(useScrollStore.getState().scrollRatio)
  // const storyId = 'test'
  const sheet = getProject(projectName).sheet(sheetName)
  const [, apiTheatre] = useSpring(() => ({
    position: 0,
    config: config.molasses,
    onChange: ({ value }) => {
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
  }, [duration, projectName])

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
        <SheetProvider key={projectName} sheet={sheet}>
          <Suspense fallback={null}>
            <LazyComponent />
          </Suspense>
        </SheetProvider>
      </Canvas>
    </div>
  )
}

export default SceneManager
