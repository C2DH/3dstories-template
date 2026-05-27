import TheKnightsArmorModel from '../models/Armor'
import { Suspense } from 'react'
import { PerspectiveCamera } from '@react-three/drei'
import SceneMinimap from '../SceneMinimap'

const TheKnightsArmorScene = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[5, -5, -5]} fov={75} />

      <pointLight position={[10, 10, 10]} />
      <ambientLight />
      <directionalLight
        position={[5, 0, 0]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <group>
        <Suspense fallback={null}>
          <TheKnightsArmorModel position={[0, 0.4, 0]} rotation={0} scale={4} />
        </Suspense>
      </group>
      <SceneMinimap />
    </>
  )
}

export default TheKnightsArmorScene
