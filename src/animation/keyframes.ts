export type Vec3 = [number, number, number]

export type KeyframeValue = number | Vec3

export interface AnimationKeyframe {
  frame: number
  position?: Vec3
  rotation?: Vec3
  scale?: Vec3
  [key: string]: KeyframeValue | undefined
}

export type AnimationTracks = Record<string, AnimationKeyframe[]>

export interface NormalizedAnimationData {
  fps?: number
  tracks: AnimationTracks
}

const DEFAULT_FPS = 30

const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

const isVec3 = (value: unknown): value is Vec3 =>
  Array.isArray(value) &&
  value.length === 3 &&
  value.every((entry) => isNumber(entry))

const lerp = (from: number, to: number, alpha: number): number =>
  from + (to - from) * alpha

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

const sanitizeTrack = (track: unknown): AnimationKeyframe[] => {
  if (!Array.isArray(track)) {
    return []
  }

  return track
    .filter((keyframe): keyframe is AnimationKeyframe => {
      return (
        !!keyframe &&
        typeof keyframe === 'object' &&
        isNumber((keyframe as AnimationKeyframe).frame)
      )
    })
    .sort((a, b) => a.frame - b.frame)
}

export const normalizeAnimationData = (
  rawAnimationData: unknown,
): NormalizedAnimationData => {
  if (!rawAnimationData || typeof rawAnimationData !== 'object') {
    return { tracks: {} }
  }

  const candidate = rawAnimationData as {
    fps?: unknown
    tracks?: unknown
    [key: string]: unknown
  }

  const fps = isNumber(candidate.fps) ? candidate.fps : undefined
  const rawTracks =
    candidate.tracks && typeof candidate.tracks === 'object'
      ? (candidate.tracks as Record<string, unknown>)
      : (candidate as Record<string, unknown>)

  const tracks = Object.entries(rawTracks).reduce(
    (accumulator, [targetId, track]) => {
      if (targetId === 'fps' || targetId === 'tracks') {
        return accumulator
      }

      const sanitized = sanitizeTrack(track)
      if (sanitized.length > 0) {
        accumulator[targetId] = sanitized
      }

      return accumulator
    },
    {} as AnimationTracks,
  )

  return {
    fps,
    tracks,
  }
}

const interpolateValue = (
  previousValue: KeyframeValue | undefined,
  nextValue: KeyframeValue | undefined,
  alpha: number,
): KeyframeValue | undefined => {
  if (isNumber(previousValue) && isNumber(nextValue)) {
    return lerp(previousValue, nextValue, alpha)
  }

  if (isVec3(previousValue) && isVec3(nextValue)) {
    return [
      lerp(previousValue[0], nextValue[0], alpha),
      lerp(previousValue[1], nextValue[1], alpha),
      lerp(previousValue[2], nextValue[2], alpha),
    ]
  }

  if (nextValue !== undefined) {
    return nextValue
  }

  return previousValue
}

export const sampleTrack = (
  track: AnimationKeyframe[],
  frame: number,
): Partial<AnimationKeyframe> => {
  if (track.length === 0) {
    return {}
  }

  if (track.length === 1) {
    const { frame: _ignoredFrame, ...onlyValues } = track[0]
    return onlyValues
  }

  const firstKeyframe = track[0]
  if (frame <= firstKeyframe.frame) {
    const { frame: _ignoredFrame, ...firstValues } = firstKeyframe
    return firstValues
  }

  const lastKeyframe = track[track.length - 1]
  if (frame >= lastKeyframe.frame) {
    const { frame: _ignoredFrame, ...lastValues } = lastKeyframe
    return lastValues
  }

  let previous = firstKeyframe
  let next = lastKeyframe

  for (let index = 1; index < track.length; index += 1) {
    const candidate = track[index]
    if (candidate.frame >= frame) {
      next = candidate
      previous = track[index - 1]
      break
    }
  }

  const frameSpan = next.frame - previous.frame
  const alpha =
    frameSpan === 0 ? 0 : clamp((frame - previous.frame) / frameSpan, 0, 1)

  const keys = new Set([...Object.keys(previous), ...Object.keys(next)])
  keys.delete('frame')

  const result: Partial<AnimationKeyframe> = {}
  keys.forEach((key) => {
    const interpolated = interpolateValue(previous[key], next[key], alpha)
    if (interpolated !== undefined) {
      result[key] = interpolated
    }
  })

  return result
}

export const resolveFrameFromScroll = (
  scrollRatio: number,
  durationSeconds: number,
  fps: number = DEFAULT_FPS,
): number => {
  const safeDuration = Number.isFinite(durationSeconds) ? durationSeconds : 0
  const safeRatio = clamp(Number.isFinite(scrollRatio) ? scrollRatio : 0, 0, 1)
  const safeFps = isNumber(fps) && fps > 0 ? fps : DEFAULT_FPS

  return safeRatio * safeDuration * safeFps
}

export const applySampleToTarget = (
  target: Record<string, any>,
  sample: Partial<AnimationKeyframe>,
): void => {
  Object.entries(sample).forEach(([property, value]) => {
    if (property === 'position' && isVec3(value) && target.position?.set) {
      target.position.set(value[0], value[1], value[2])
      return
    }

    if (property === 'rotation' && isVec3(value) && target.rotation?.set) {
      target.rotation.set(value[0], value[1], value[2])
      return
    }

    if (property === 'scale' && isVec3(value) && target.scale?.set) {
      target.scale.set(value[0], value[1], value[2])
      return
    }

    if (isNumber(value) && property in target) {
      target[property] = value
    }
  })
}
