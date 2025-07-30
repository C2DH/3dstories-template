import { useEffect, useRef, useState } from 'react'
import { UAParser } from 'ua-parser-js'
import { useViewportStore } from '../store'

const ViewportManager = () => {
  const timeoutId = useRef<number | null>(null)
  const [device] = useState(() => new UAParser().getDevice())

  console.info(
    '[ViewportManager] \n - navigator.userAgent',
    navigator.userAgent,
    '\n - device:',
    device
  )

  const updateAvailableDimensions = useViewportStore(
    (state) => state.updateAvailableDimensions
  )
  useEffect(() => {
    const resize = () => {
      if (timeoutId.current) clearTimeout(timeoutId.current)
      timeoutId.current = window.setTimeout(() => {
        updateAvailableDimensions()
      }, 500)
    }

    window.addEventListener('resize', resize)
    resize() // Initial call to set dimensions on mount
    return () => {
      console.info('[ViewportManager] @useEffect cleanup')
      window.removeEventListener('resize', resize)
      if (timeoutId.current) clearTimeout(timeoutId.current)
    }
  }, [])

  return null
}

export default ViewportManager
