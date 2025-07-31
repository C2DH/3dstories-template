import type { StoryTableOfContent } from '../types'
import { Link } from 'react-router-dom'

interface MenuProps {
  lang: string
  items: StoryTableOfContent[]
}

const Menu: React.FC<MenuProps> = ({ lang, items = [] }) => {
  return (
    <nav className='fixed bottom-0 right-0 z-20 bg-white p-4 shadow-lg'>
      <ul>
        {items.map((story) => (
          <li key={story.id}>
            <Link to={`/${lang}/${story.id}`}>
              {' '}
              id={story.id} {story.title}
            </Link>
            <ul>
              {story.sections.map((section) => (
                <li key={section.id}>
                  <Link to={`/${lang}/${story.id}#${section.id}`}>
                    {section.id} {section.title}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Menu
