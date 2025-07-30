import { useScrollStore } from '../store'

const ScrollDebug: React.FC = () => {
  const scrollRatio = useScrollStore((state) => state.scrollRatio)
  const page = useScrollStore((state) => state.page)

  return (
    <div className='fixed bottom-4 left-4 bg-white bg-opacity-80 p-4 rounded shadow ScrollDebug'>
      <p>Scroll Ratio: {scrollRatio}</p>
      <p>Current Page: {page}</p>
    </div>
  )
}

export default ScrollDebug
