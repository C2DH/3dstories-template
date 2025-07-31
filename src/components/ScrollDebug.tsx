import { useSceneStore, useScrollStore } from '../store'

const ScrollDebug: React.FC = () => {
  const scrollRatio = useScrollStore((state) => state.scrollRatio)
  const page = useScrollStore((state) => state.page)
  const storyId = useSceneStore((state) => state.storyId)
  const duration = useSceneStore((state) => state.duration)
  return (
    <div className='fixed bottom-4 z-20 left-4 bg-white bg-opacity-80 p-4 rounded shadow ScrollDebug'>
      <p>Scroll Ratio: {scrollRatio}</p>
      <p>Current Page: {page}</p>
      <p>Current Story ID: {storyId}</p>
      <p>Current Duration: {duration}</p>
    </div>
  )
}

export default ScrollDebug
