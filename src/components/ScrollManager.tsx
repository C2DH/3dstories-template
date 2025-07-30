import { useViewportStore } from '../store'

interface ScrollManagerProps {
  header: { id: string; title: string }
  sections: { id: string; title: string }[]
}
const ScrollManager: React.FC<ScrollManagerProps> = ({ header, sections }) => {
  const height = useViewportStore((state) => state.availableHeight)

  const pages = [
    {
      id: header.id,
      title: header.title,
      height, // Adjusted for the header
    },
    ...sections.map((section) => ({
      id: section.id,
      title: section.title,
      height,
    })),
  ]
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        width: '100%',
        height: pages.length * height,
      }}
    >
      {pages.map((d, i, arr) => (
        <div
          className='page-content'
          key={'i' + i}
          style={{
            top: 0,
            width: '100%',
            height: pages.length * height,
          }}
        >
          <h2>{d.title}</h2>
        </div>
      ))}
    </div>
  )
}

export default ScrollManager
