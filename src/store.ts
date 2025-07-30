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

interface ScrollState {
  scrollRatio: number
  page: number
  menuLinkPosition: number
  setScrollRatio: (scrollRatio: number) => void
  setPage: (page: number) => void
  setMenuLinkPosition: (menuLinkPosition: number) => void
}

export const useScrollStore = create<ScrollState>((set, get) => ({
  scrollRatio: 0,
  page: 0,
  menuLinkPosition: 0,
  setPage: (page) => {
    if (get().page !== page) {
      set({ page })
    }
  },
  setScrollRatio: (scrollRatio) =>
    set({
      scrollRatio,
    }),
  setMenuLinkPosition: (menuLinkPosition) => set({ menuLinkPosition }),
}))
