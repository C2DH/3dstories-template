import { useSceneStore, useScrollStore } from '../store'
import { useState } from 'react'

const ScrollDebug: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const scrollRatio = useScrollStore((state) => state.scrollRatio)
  const page = useScrollStore((state) => state.page)
  const storyId = useSceneStore((state) => state.storyId)
  const duration = useSceneStore((state) => state.duration)

  return (
    <>
      <button
        type='button'
        onClick={() => setIsOpen((prev) => !prev)}
        className='fixed bottom-4 right-4 z-20 bg-white px-3 py-2 shadow'
      >
        {isOpen ? 'Hide scroll debug' : 'Show scroll debug'}
      </button>

      {isOpen && (
        <div className='fixed bottom-4 right-4 z-20 rounded bg-white bg-opacity-80 p-4 shadow ScrollDebug'>
          <button
            type='button'
            onClick={() => setIsOpen(false)}
            className='absolute top-1 right-1 text-sm text-gray-500 hover:text-gray-700'
          >
            ×
          </button>
          <p>Scroll Ratio: {scrollRatio}</p>
          <p>Current Page: {page}</p>
          <p>Current Story ID: {storyId}</p>
          <p>Current Duration: {duration}</p>
        </div>
      )}
    </>
  )
}

export default ScrollDebug
