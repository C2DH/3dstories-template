import { useEffect, useRef } from 'react'
import { useScrollStore, useViewportStore } from '../store'

interface ScrollManagerProps {
  header: { id: string; title: string; content?: string }
  sections: { id: string; title: string; content?: string }[]
  defaultPageSpeed?: number
}
const ScrollManager: React.FC<ScrollManagerProps> = ({
  header,
  sections,
  defaultPageSpeed = 1.5,
}) => {
  const height = useViewportStore((state) => state.availableHeight)
  const setScrollRatio = useScrollStore((state) => state.setScrollRatio)
  const setPage = useScrollStore((state) => state.setPage)

  const pageRef = useRef(useScrollStore.getState().page)
  const animationFrameRef = useRef<number | null>(null)

  const id = header.id

  const pages = [
    {
      id: header.id,
      title: header.title,
      content: header.content,
    },
    ...sections.map((section) => ({
      id: section.id,
      title: section.title,
      content: section.content,
    })),
  ]
  const pageHeight = height * defaultPageSpeed
  const totalHeight = height * defaultPageSpeed * pages.length

  useEffect(() => {
    const handleScroll = () => {
      if (animationFrameRef.current !== null) return

      animationFrameRef.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY
        const ratio = scrollY / (totalHeight - height)
        const page = Math.floor((scrollY + height / 2) / pageHeight)
        if (pageRef.current !== page) {
          pageRef.current = page
          setPage(page)
        }
        setScrollRatio(ratio)

        animationFrameRef.current = null
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      setScrollRatio(0)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [id, height, pages.length, setPage, setScrollRatio])

  return (
    <>
      <div
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          left: 0,
          top: 0,
          width: '100%',
          height: pages.length * height * defaultPageSpeed,
        }}
      >
        {pages.map((d, i, arr) => (
          <div
            className='page-content'
            key={'i' + i}
            style={{
              top: 0,
              width: '100%',
              height: height * defaultPageSpeed,
            }}
          >
            <hr />
          </div>
        ))}
      </div>
      {/*
        // Uncomment to visualize the browser middle height where page change
        <div
        style={{
          position: 'fixed',
          borderTop: '2px solid red',
          width: '100%',
          top: height / 2,
        }}
      /> */}
    </>
  )
}

export default ScrollManager
