import { editable as e } from '@theatre/r3f'
import { PerspectiveCamera } from '@theatre/r3f'
import { Model as Character } from '../models/Character'
const CharacterScene = () => {
  return (
    <>
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
      <e.group theatreKey='Character'>
        <Character position={[0, 0.4, 0]} rotation={0} scale={4} />
      </e.group>
    </>
  )
}

export default CharacterScene
