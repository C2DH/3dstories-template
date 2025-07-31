import type { StorySection } from '../types'
import { useLoaderData } from 'react-router'
import ScrollManager from './ScrollManager'
import { useViewportStore } from '../store'

const Story: React.FC<{ defaultPageSpeed?: number }> = ({
  defaultPageSpeed = 1.5,
}) => {
  const height = useViewportStore((state) => state.availableHeight)
  const { data, lang } = useLoaderData() as {
    lang: string
    data: StorySection
  }
  const header = {
    title: data.title[lang],
    content: data.content ? data.content[lang] : undefined,
    id: data.id,
  }
  const sections =
    data.sections?.map((section) => ({
      id: section.id,
      title: section.title[lang],
      content: section.content ? section.content[lang] : undefined,
    })) || []

  return (
    <div className='absolute inset-0 z-10'>
      <div
        className='flex flex-col items-center justify-center text-center p-4'
        style={{
          height: height,
          overflowY: 'hidden',
          marginBottom: height * defaultPageSpeed - height,
        }}
      >
        <h1 className='text-3xl font-bold mb-4'>{header.title}</h1>
        {header.content && <p className='mb-4'>{header.content}</p>}
      </div>

      {sections.map((section) => (
        <div
          key={section.id}
          id={section.id}
          className='flex flex-col items-center justify-center text-center p-4'
          style={{
            height: height * defaultPageSpeed,
            overflowY: 'hidden',
          }}
        >
          <h2 className='text-2xl font-bold mb-2'>{section.title}</h2>
          {section.content && <p className='mb-2'>{section.content}</p>}
        </div>
      ))}
      <ScrollManager
        header={header}
        sections={sections}
        defaultPageSpeed={defaultPageSpeed}
      />
    </div>
  )
}

export default Story
