import { lazy, Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { useScrollStore } from '../store'

const availableSceneComponents = Object.keys(
  import.meta.glob('./scenes/*.tsx'),
).reduce(
  (acc, path) => {
    const componentPath = path.replace('./scenes/', '')
    if (componentPath) {
      acc[componentPath] = path
    }
    return acc
  },
  {} as Record<string, string>,
)

const availableSceneStates = Object.keys(
  import.meta.glob('./states/*.json'),
).reduce(
  (acc, path) => {
    const statePath = path.replace('./states/', '')
    if (statePath) {
      acc[statePath] = path
    }
    return acc
  },
  {} as Record<string, string>,
)

interface SceneManagerProps {
  editable?: boolean
  duration: number
  projectName: string
  // Optional path to the Theatre.js project state JSON file
  // relative to the `./states/` folder.
  // If provided, the scene will use this state to initialize the Theatre.js project.
  // If not provided, the scene will use the Theatre.js local database, named after the story identifier.

  statePath?: string
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
  componentPath,
  gl = {
    preserveDrawingBuffer: true,
    antialias: false,
  },
}) => {
  if (!availableSceneComponents[componentPath]) {
    console.error(
      `[SceneManager] Component path "${componentPath}" not found in available src/components/scenes fodler. Available components: ${Object.keys(
        availableSceneComponents,
      ).join(', ')}`,
    )
    return <div>Scene component not found</div>
  }
  const componentImportPath = availableSceneComponents[componentPath]

  const scrollRatioRef = useRef(useScrollStore.getState().scrollRatio)

  const LazyComponent = lazy(
    () => import(/* @vite-ignore */ componentImportPath),
  )

  return (
    <div className='SceneManagerLite fixed top-0 left-0 h-screen w-screen bg-gray-100 z-0'>
      <Canvas
        shadows
        gl={gl}
        camera={{
          position: [5, -5, 0],
          fov: 75,
        }}
      >
        <Suspense fallback={null}>
          <LazyComponent />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default SceneManager
