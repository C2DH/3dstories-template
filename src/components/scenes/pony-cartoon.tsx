import PonyCartoonModel from "../models/PonyCartoon";
import { useMemo, useRef } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import type {
  Group,
  PerspectiveCamera as ThreePerspectiveCamera,
  PointLight,
} from "three";
import useAnimationPlayer from "../../hooks/useAnimationPlayer";

interface PonyCartoonSceneProps {
  animationState?: unknown;
  duration?: number;
}

const PonyCartoonScene: React.FC<PonyCartoonSceneProps> = ({
  animationState,
  duration = 10,
}) => {
  const cameraRef = useRef<ThreePerspectiveCamera | null>(null);
  const lightRef = useRef<PointLight | null>(null);
  const modelRef = useRef<Group | null>(null);

  const bindings = useMemo(
    () => ({
      camera: cameraRef,
      light: lightRef,
      model: modelRef,
    }),
    [],
  );

  useAnimationPlayer({
    animationData: animationState,
    durationSeconds: duration,
    bindings,
  });

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 1.8, 8]}
        fov={65}
      />

      <pointLight ref={lightRef} position={[8, 8, 8]} intensity={1.2} />
      <ambientLight intensity={0.8} />
      <directionalLight
        position={[4, 2, 6]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <group ref={modelRef} position={[0, -0.45, 0]} scale={[1, 1, 1]}>
        <PonyCartoonModel />
      </group>
    </>
  );
};

export default PonyCartoonScene;
