import { create } from 'zustand'

const OrientationModePortrait = 'portrait'
const OrientationModeLandscape = 'landscape'

interface ViewportState {
  availableHeight: number
  availableWidth: number
  orientation: 'portrait' | 'landscape' | null
  hasOrientationChanged?: boolean
  updateAvailableDimensions: () => void
}

export const useViewportStore = create<ViewportState>((set) => ({
  availableHeight: window.innerHeight,
  availableWidth: window.innerWidth,
  isPortrait: undefined,
  orientation: null,
  setAvailableHeight: (availableHeight: number) => set({ availableHeight }),
  setAvailableWidth: (availableWidth: number) => set({ availableWidth }),
  updateAvailableDimensions: () =>
    set((state) => {
      const orientation =
        window.innerHeight > window.innerWidth
          ? OrientationModePortrait
          : OrientationModeLandscape
      const hasOrientationChanged =
        state.orientation !== null && state.orientation !== orientation
      console.debug(
        '[store/useViewportStore] updateAvailableDimensions',
        '\n',
        'availableHeight:',
        window.innerHeight,
        '\n',
        'availableWidth:',
        window.innerWidth,
        '\n',
        'orientation:',
        orientation,
        '\n',
        'hasOrientationChanged:',
        hasOrientationChanged
      )
      return {
        availableHeight: window.innerHeight,
        availableWidth: window.innerWidth,
        hasOrientationChanged,
        ...(hasOrientationChanged ? { orientation } : {}),
      }
    }),
}))
