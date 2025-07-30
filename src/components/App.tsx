import { createBrowserRouter, Outlet, RouterProvider } from 'react-router'
import ViewportManager from './ViewportManager'
import Menu from './Menu'
import type { StoryTableOfContent } from '../types'
import { AvailableLanguages, Basename } from '../constants'
import type { AvailableLanguage } from '../constants'
import Story from './Story'
import '../styles/global.css'
import ScrollDebug from './ScrollDebug'
import World from './World'
const AppRouterLayout: React.FC<{
  lang: string
  tableOfContents: StoryTableOfContent[]
}> = ({ lang, tableOfContents }) => {
  return (
    <>
      <ViewportManager />
      <ScrollDebug />
      <Menu lang={lang} items={tableOfContents} />
      <Outlet />
      <World></World>
    </>
  )
}

const App: React.FC<{
  lang: string
  basename: string
  tableOfContents: StoryTableOfContent[]
  availableLanguages: AvailableLanguage[]
}> = ({ basename, availableLanguages = AvailableLanguages, ...props }) => {
  const router = createBrowserRouter(
    [
      {
        path: '/',
        element: <AppRouterLayout {...props} />,
        children: [
          {
            path: '/',
            element: null,
          },
          ...availableLanguages.map((lang) => ({
            path: lang,
            element: null,

            children: props.tableOfContents.map((story) => ({
              path: story.id,
              Component: Story,
              loader: async () => {
                const dataUrl = `${Basename}/data/${story.id}.json`
                // return data from here
                console.debug(
                  '[App] loader for story:',
                  story.id,
                  '- lang:',
                  lang,
                  dataUrl
                )
                return {
                  lang,
                  data: await fetch(dataUrl).then((res) => res.json()),
                }
              },
            })),
          })),
        ],
      },
    ],
    {
      basename,
    }
  )
  return <RouterProvider router={router} />
}

export default App
