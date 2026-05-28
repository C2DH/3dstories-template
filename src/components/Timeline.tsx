import { useEffect, useMemo, useRef } from 'react'
import {
  normalizeAnimationData,
  resolveFrameFromScroll,
} from '../animation/keyframes'
import { useScrollStore } from '../store'

interface TimelineProps {
  animationData?: unknown
  durationSeconds?: number
  className?: string
  sidePaddingPercent?: number
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

const Timeline: React.FC<TimelineProps> = ({
  animationData,
  durationSeconds = 10,
  className = '',
  sidePaddingPercent = 8,
}) => {
  const playheadRef = useRef<HTMLDivElement | null>(null)
  const tooltipRef = useRef<HTMLSpanElement | null>(null)

  const normalized = useMemo(
    () => normalizeAnimationData(animationData),
    [animationData],
  )

  const rows = useMemo(
    () =>
      Object.entries(normalized.tracks).map(([targetId, track]) => {
        const frames = [
          ...new Set(track.map((keyframe) => keyframe.frame)),
        ].sort((a, b) => a - b)

        return {
          targetId,
          frames,
          firstFrame: frames[0] ?? 0,
          lastFrame: frames[frames.length - 1] ?? 0,
        }
      }),
    [normalized.tracks],
  )

  const maxFrame = useMemo(() => {
    const allFrames = rows.flatMap((row) => row.frames)
    if (allFrames.length === 0) {
      return 1
    }

    return Math.max(...allFrames)
  }, [rows])

  if (rows.length === 0) {
    return null
  }

  const safePadding = clamp(sidePaddingPercent, 2, 25)
  const timelineWidthPercent = 100 - safePadding * 2

  // Keep latest conversion params in a ref so the subscription below never
  // needs to be torn down/recreated when animationData or duration changes.
  const conversionRef = useRef({
    maxFrame: 1,
    safePadding,
    timelineWidthPercent,
    durationSeconds,
    fps: normalized.fps ?? 30,
  })
  conversionRef.current = {
    maxFrame: maxFrame <= 0 ? 1 : maxFrame,
    safePadding,
    timelineWidthPercent,
    durationSeconds,
    fps: normalized.fps ?? 30,
  }

  // Subscribe once — direct DOM update, zero React re-renders.
  useEffect(() => {
    return useScrollStore.subscribe((state) => {
      const {
        maxFrame: mf,
        safePadding: sp,
        timelineWidthPercent: tw,
        durationSeconds: dur,
        fps,
      } = conversionRef.current
      const frame = resolveFrameFromScroll(state.scrollRatio, dur, fps)
      const x = sp + (frame / mf) * tw
      if (playheadRef.current) playheadRef.current.style.left = `${x}%`
      if (tooltipRef.current)
        tooltipRef.current.textContent = `${Math.round(frame)}`
    })
  }, [])

  const frameToXPercent = (frame: number): number => {
    if (maxFrame <= 0) {
      return safePadding
    }

    return safePadding + (frame / maxFrame) * timelineWidthPercent
  }

  return (
    <div
      className={`rounded-md border border-neutral-300 bg-white/90 p-3 shadow-md ${className}`}
    >
      <p className='mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-700'>
        Timeline (0 - {maxFrame} frames)
      </p>
      {/* Two-column layout: fixed label column + track column that owns the playhead */}
      <div className='flex gap-3'>
        {/* Labels — fixed width matches grid label column */}
        <div className='w-[110px] shrink-0 space-y-3'>
          {rows.map((row) => (
            <div key={row.targetId} className='flex h-4 items-center'>
              <span className='truncate text-xs font-medium text-neutral-800'>
                {row.targetId}
              </span>
            </div>
          ))}
        </div>

        {/* Track column — playhead and dots share the same coordinate space */}
        <div className='relative min-w-0 flex-1 space-y-3'>
          {/* Single playhead spanning all rows */}
          <div
            ref={playheadRef}
            className='pointer-events-none absolute top-0 bottom-0 z-10 w-px -translate-x-1/2 bg-blue-500'
            style={{ left: `${safePadding}%`, transition: 'left 80ms linear' }}
          >
            <span
              ref={tooltipRef}
              className='absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-blue-500 px-1 py-0.5 font-mono text-[10px] leading-none text-white'
            >
              0
            </span>
          </div>

          {rows.map((row) => {
            const firstX = frameToXPercent(row.firstFrame)
            const lastX = frameToXPercent(row.lastFrame)

            return (
              <div key={row.targetId} className='relative h-4'>
                {/* connecting line */}
                <div
                  className='absolute top-1/2 h-px -translate-y-1/2 bg-neutral-400'
                  style={{
                    left: `${Math.min(firstX, lastX)}%`,
                    width: `${Math.max(0, Math.abs(lastX - firstX))}%`,
                  }}
                />

                {/* keyframe dots */}
                {row.frames.map((frame, index) => (
                  <span
                    key={`${row.targetId}-${frame}-${index}`}
                    className='absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-neutral-600 bg-white'
                    style={{ left: `${frameToXPercent(frame)}%` }}
                    title={`${row.targetId}: frame ${frame}`}
                  />
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Timeline
