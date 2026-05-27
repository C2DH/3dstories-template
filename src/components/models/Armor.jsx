import { useGLTF } from '@react-three/drei'
import { forwardRef, useEffect } from 'react'
import { Basename } from '../../constants'

const modelUrl = Basename + '/models/armor.glb'

const ArmorModel = forwardRef(
  ({ position, rotation, scale, ...props }, ref) => {
    const { nodes, materials } = useGLTF(modelUrl)
    materials.material_0.depthWrite = true
    // materials.material_0.metalness = 0
    materials.material_0.transparent = true

    return (
      <group
        {...props}
        position={position}
        scale={scale}
        dispose={null}
        rotation={[0, 0, rotation]}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.armor.geometry}
          material={materials.material_0}
        />
      </group>
    )
  },
)

useGLTF.preload(modelUrl)

export default ArmorModel
