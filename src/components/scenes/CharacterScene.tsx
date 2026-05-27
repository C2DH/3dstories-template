import { useMemo, useRef } from 'react'
import { PerspectiveCamera } from '@react-three/drei'
import type {
  Group,
  Mesh,
  PerspectiveCamera as ThreePerspectiveCamera,
  PointLight,
} from 'three'
import ArmorModel from '../models/Armor'
import useAnimationPlayer from '../../hooks/useAnimationPlayer'

interface CharacterSceneProps {
  animationState?: unknown
  duration?: number
}

const CharacterScene: React.FC<CharacterSceneProps> = ({
  animationState,
  duration = 10,
}) => {
  const cameraRef = useRef<ThreePerspectiveCamera | null>(null)
  const lightRef = useRef<PointLight | null>(null)
  const characterRef = useRef<Mesh | null>(null)
  const armorRef = useRef<Group | null>(null)

  const bindings = useMemo(
    () => ({
      camera: cameraRef,
      light: lightRef,
      character: characterRef,
      armor: armorRef,
    }),
    [],
  )

  useAnimationPlayer({
    animationData: animationState,
    durationSeconds: duration,
    bindings,
  })

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[5, -5, -5]}
        fov={75}
      />

      <pointLight ref={lightRef} position={[10, 10, 10]} />
      <ambientLight />
      {/* Add a directional light from the right to cast a right shadow */}
      <directionalLight
        position={[5, 0, 0]} // right side
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <mesh ref={characterRef} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color='orange' />
      </mesh>
      <group ref={armorRef} position={[0, 0.4, 0]} scale={[4, 4, 4]}>
        <ArmorModel />
      </group>
    </>
  )
}

export default CharacterScene
