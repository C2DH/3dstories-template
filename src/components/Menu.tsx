import type { StoryToCItem } from '../types'
import type { AvailableLanguage } from '../constants'
import { Link } from 'react-router-dom'
import { useState } from 'react'

interface MenuProps {
  lang: AvailableLanguage
  items: StoryToCItem[]
}

const Menu: React.FC<MenuProps> = ({ lang, items = [] }) => {
  const [isOpen, setIsOpen] = useState(false)

  const closeMenu = () => setIsOpen(false)

  return (
    <>
      <button
        type='button'
        onClick={() => setIsOpen(true)}
        className='fixed top-4 right-4 z-20 bg-white px-3 py-2 shadow'
      >
        Table of contents
      </button>

      {isOpen && (
        <nav className='fixed inset-0 z-30 overflow-y-auto bg-white p-6'>
          <button
            type='button'
            onClick={closeMenu}
            className='fixed top-4 right-4 bg-white px-3 py-2 shadow'
          >
            Close
          </button>

          <ul className='pt-14'>
            {items.map((story) => (
              <li key={story.id} className='mb-4'>
                <Link to={`/${lang}/${story.id}`} onClick={closeMenu}>
                  {story.id} {story.title[lang]}
                </Link>

                <ul className='mt-2 pl-4'>
                  {story.sections.map((section) => (
                    <li key={section.id} className='mb-1'>
                      <Link
                        to={`/${lang}/${story.id}#${section.id}`}
                        onClick={closeMenu}
                      >
                        {section.id} {section.title[lang]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  )
}

export default Menu
