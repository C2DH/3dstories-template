import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Timeline from './Timeline'
import JsonEditorWindow from './JsonEditorWindow'

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
  duration,
  projectName,
  statePath,
  sheetName,
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
  const [animationState, setAnimationState] = useState<unknown>(undefined)
  const [editableAnimationState, setEditableAnimationState] =
    useState<unknown>(undefined)
  const [stateLoadingComplete, setStateLoadingComplete] = useState(false)
  const [isJsonEditorOpen, setIsJsonEditorOpen] = useState(false)
  const [isTimelineVisible, setIsTimelineVisible] = useState(true)

  const LazyComponent = useMemo(
    () => lazy(() => import(/* @vite-ignore */ componentImportPath)),
    [componentImportPath],
  )

  useEffect(() => {
    let mounted = true

    const loadAnimationState = async () => {
      if (!statePath) {
        if (mounted) {
          setAnimationState(undefined)
          setEditableAnimationState(undefined)
          setStateLoadingComplete(true)
        }
        return
      }

      const importPath = availableSceneStates[statePath]
      if (!importPath) {
        console.warn(
          `[SceneManagerLite] State \"${statePath}\" not found. Available states: ${Object.keys(
            availableSceneStates,
          ).join(', ')}`,
        )
        if (mounted) {
          setAnimationState(undefined)
          setEditableAnimationState(undefined)
          setStateLoadingComplete(true)
        }
        return
      }

      try {
        const stateModule = await import(/* @vite-ignore */ importPath)
        if (mounted) {
          setAnimationState(stateModule.default)
          setEditableAnimationState(stateModule.default)
        }
      } catch (error) {
        console.warn(
          `[SceneManagerLite] Could not load state module \"${statePath}\"`,
          error,
        )
        if (mounted) {
          setAnimationState(undefined)
          setEditableAnimationState(undefined)
        }
      } finally {
        if (mounted) {
          setStateLoadingComplete(true)
        }
      }
    }

    setStateLoadingComplete(false)
    void loadAnimationState()

    return () => {
      mounted = false
    }
  }, [statePath])

  console.info(
    `[SceneManager] Loaded component "${componentPath}" from "${componentImportPath}".`,
  )

  if (!stateLoadingComplete) {
    return <div>Loading scene metadata</div>
  }

  return (
    <div className='SceneManagerLite fixed top-0 left-0 h-screen w-screen bg-gray-100 z-0'>
      <Canvas shadows gl={gl} camera={{ position: [0, 5, 10], fov: 45 }}>
        <Suspense fallback={null}>
          <LazyComponent
            animationState={editableAnimationState}
            duration={duration}
            projectName={projectName}
            sheetName={sheetName}
          />
        </Suspense>
      </Canvas>

      {isTimelineVisible && (
        <div className='pointer-events-none absolute bottom-4 left-4 z-10 w-[min(640px,calc(100vw-2rem))]'>
          <Timeline animationData={editableAnimationState} />
        </div>
      )}

      <div className='pointer-events-auto z-20'>
        <button
          type='button'
          onClick={() => setIsTimelineVisible((prev) => !prev)}
          className='fixed bottom-28 right-4 z-20 block bg-white px-3 py-2 shadow'
        >
          {isTimelineVisible ? 'Hide timeline' : 'Show timeline'}
        </button>

        <button
          type='button'
          onClick={() => setIsJsonEditorOpen((prev) => !prev)}
          className='fixed bottom-16 right-4 z-20 block bg-white px-3 py-2 shadow'
        >
          {isJsonEditorOpen ? 'Hide JSON live editor' : 'Show JSON live editor'}
        </button>

        {isJsonEditorOpen && (
          <JsonEditorWindow
            title='Animation State (Live)'
            value={editableAnimationState}
            onChange={setEditableAnimationState}
            initialPosition={{ x: 24, y: 24 }}
          />
        )}
      </div>
    </div>
  )
}

export default SceneManager
