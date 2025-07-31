import { SheetProvider } from '@theatre/r3f'
import { PerspectiveCamera } from '@theatre/r3f'
import studio from '@theatre/studio'
import extension from '@theatre/r3f/dist/extension'
import { editable as e } from '@theatre/r3f'
import { getProject } from '@theatre/core'
import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useSpring, config } from '@react-spring/web'
import { useSceneStore, useScrollStore } from '../store'

if (import.meta.env.MODE === 'development') {
  studio.initialize()
  studio.extend(extension)
}

const Scene: React.FC = () => {
  const scrollRatioRef = useRef(useScrollStore.getState().scrollRatio)
  // const storyId = 'test'
  const duration = useSceneStore((state) => state.duration)
  const storyId = useSceneStore((state) => state.storyId)
  const [sheet, setSheet] = useState(() => getProject(storyId).sheet(storyId))

  const [, apiTheatre] = useSpring(() => ({
    position: 0,
    config: config.molasses,
    onChange: ({ value }) => {
      sheet.sequence.position = value.position
    },
  }))

  useEffect(() => {
    return useScrollStore.subscribe((state) => {
      scrollRatioRef.current = state.scrollRatio
      apiTheatre.start({
        position: scrollRatioRef.current * duration,
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, storyId])

  useEffect(() => {
    if (import.meta.env.MODE === 'development') {
      console.debug('[Scene] Theatre project initialized:', storyId)
    }
    setSheet(getProject(storyId).sheet(storyId))
  }, [storyId])

  console.debug('[Scene] Rendering with storyId:', storyId, sheet)
  return (
    <div className='fixed top-0 left-0 h-screen w-screen bg-gray-100 z-0'>
      <Canvas
        shadows
        camera={{
          position: [5, 5, -5],
          fov: 75,
        }}
      >
        {sheet && (
          <SheetProvider key={storyId} sheet={sheet}>
            <PerspectiveCamera
              theatreKey={'Camera'}
              makeDefault
              position={[5, 5, -5]}
              fov={75}
            />

            <e.pointLight theatreKey={'Light'} position={[10, 10, 10]} />
            <ambientLight />
            {/* Add a directional light from the right to cast a right shadow */}
            <directionalLight
              position={[5, 0, 0]} // right side
              intensity={1}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            <e.mesh castShadow receiveShadow theatreKey={'Box'}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color='orange' />
            </e.mesh>
          </SheetProvider>
        )}
      </Canvas>
    </div>
  )
}

export default Scene
