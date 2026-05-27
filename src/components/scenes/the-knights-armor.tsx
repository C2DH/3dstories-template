import TheKnightsArmorModel from '../models/Armor'
import { useMemo, useRef } from 'react'
import { PerspectiveCamera } from '@react-three/drei'
import type { Group, PerspectiveCamera as ThreePerspectiveCamera, PointLight } from 'three'
import useAnimationPlayer from '../../hooks/useAnimationPlayer'

interface TheKnightsArmorSceneProps {
  animationState?: unknown
  duration?: number
}

const TheKnightsArmorScene: React.FC<TheKnightsArmorSceneProps> = ({
  animationState,
  duration = 10,
}) => {
  const cameraRef = useRef<ThreePerspectiveCamera | null>(null)
  const lightRef = useRef<PointLight | null>(null)
  const modelRef = useRef<Group | null>(null)

  const bindings = useMemo(
    () => ({
      camera: cameraRef,
      light: lightRef,
      model: modelRef,
    }),
    [],
  )

  useAnimationPlayer({
    animationData: animationState,
    durationSeconds: duration,
    bindings,
  })

  console.info('[TheKnightsArmorScene] rendering scene')
  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 2, 8]} fov={75} />

      <pointLight ref={lightRef} position={[10, 10, 10]} />
      <ambientLight />
      <directionalLight
        position={[5, 0, 0]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <group ref={modelRef} position={[0, 0.4, 0]} scale={[4, 4, 4]}>
        <TheKnightsArmorModel />
      </group>
    </>
  )
}

export default TheKnightsArmorScene
