import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScrollStore } from '../store'
import {
  applySampleToTarget,
  normalizeAnimationData,
  resolveFrameFromScroll,
  sampleTrack,
  type AnimationKeyframe,
} from '../animation/keyframes'

interface AnimationBinding {
  current: Record<string, any> | null
}

interface UseAnimationPlayerParams {
  animationData?: unknown
  bindings: Record<string, AnimationBinding>
  durationSeconds: number
  fps?: number
}

export const useAnimationPlayer = ({
  animationData,
  bindings,
  durationSeconds,
  fps,
}: UseAnimationPlayerParams): void => {
  const normalized = useMemo(
    () => normalizeAnimationData(animationData),
    [animationData],
  )

  const effectiveFps = fps ?? normalized.fps ?? 30

  useFrame(() => {
    const scrollRatio = useScrollStore.getState().scrollRatio
    const currentFrame = resolveFrameFromScroll(
      scrollRatio,
      durationSeconds,
      effectiveFps,
    )

    Object.entries(normalized.tracks).forEach(([targetId, track]) => {
      const target = bindings[targetId]?.current
      if (!target) {
        return
      }

      const sampledValues = sampleTrack(
        track as AnimationKeyframe[],
        currentFrame,
      )
      applySampleToTarget(target, sampledValues)

      if (typeof target.updateProjectionMatrix === 'function') {
        target.updateProjectionMatrix()
      }
    })
  })
}

export default useAnimationPlayer
