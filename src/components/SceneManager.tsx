import { getProject, type IProject } from '@theatre/core'
import { useEffect, useState } from 'react'
import SceneManagerCanvas from './SceneManagerCanvas'

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

const availableSceneStates = Object.keys(
  import.meta.glob('./states/*.json')
).reduce(
  (acc, path) => {
    const statePath = path.replace('./states/', '')
    if (statePath) {
      acc[statePath] = path
    }
    return acc
  },
  {} as Record<string, string>
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
  editable = false,
  duration,
  projectName,
  sheetName,
  statePath,
  componentPath,
  gl = {
    preserveDrawingBuffer: true,
    antialias: false,
  },
}) => {
  const [project, setProject] = useState<IProject | null>(null)

  useEffect(() => {
    if (!availableSceneComponents[componentPath]) {
      console.error(
        `[SceneManager] Component path "${componentPath}" not found in available src/components/scenes fodler. Available components: ${Object.keys(
          availableSceneComponents
        ).join(', ')}`
      )
      return
    }

    if (statePath && !availableSceneStates[statePath]) {
      console.error(
        `[SceneManager] State "${statePath}" not found in available src/components/states folder. Available states: ${Object.keys(
          availableSceneStates
        ).join(', ')}`
      )
      return
    }
    const loadStudioAndState = async () => {
      let project = null
      console.debug(
        '[SceneManager] Loading Theatre.js project:',
        projectName,
        '- statePath:',
        statePath,
        '- sheetName:',
        sheetName,
        '- componentPath:',
        componentPath,
        '- editable:',
        editable
      )
      // 1. Initialize Theatre.js Studio if editable
      if (editable) {
        try {
          const extensionModule = await import(
            /* @vite-ignore */ '@theatre/r3f/dist/extension'
          )
          const extension = extensionModule.default
          const studioModule = await import(
            /* @vite-ignore */ '@theatre/studio'
          )
          const studio = studioModule.default
          studio.initialize()
          studio.extend(extension)
        } catch (err) {
          console.error(`Could not initialize Theatre.js studio`, err)
          // Still continue to load the state even if studio init fails
        }
      }

      // 2. Dynamically import state
      if (statePath && availableSceneStates[statePath]) {
        try {
          const stateAsJson = await import(
            /* @vite-ignore */ availableSceneStates[statePath]
          )
          const state = stateAsJson.default
          project = getProject(projectName, { state })
        } catch (err) {
          console.warn(
            `No state available for Theatre Project. Could not load state module: ${statePath}`,
            err
          )
          project = getProject(projectName)
        }
      } else if (statePath) {
        console.warn(
          `The state you selected is not available! State path "${statePath}" not found in availableSceneStates`
        )
      }
      if (!project) {
        // initialize with in memory project
        project = getProject(projectName)
      }
      await project.ready
      setProject(project)
    }

    loadStudioAndState()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!project) {
    return <div>Loading scene</div>
  }

  const sheet = project.sheet(sheetName)

  return (
    <SceneManagerCanvas
      duration={duration}
      sheetProviderKey={`${projectName}-${sheetName}`}
      sheet={sheet}
      componentImportPath={availableSceneComponents[componentPath]}
      gl={gl}
    />
  )
}

export default SceneManager
