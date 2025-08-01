import { createBrowserRouter, Outlet, RouterProvider } from 'react-router'
import ViewportManager from './ViewportManager'
import Menu from './Menu'
import type { StoryToCItem, StoryData } from '../types'
import { AvailableLanguages, Basename } from '../constants'
import type { AvailableLanguage } from '../constants'
import Story from './Story'
import '../styles/global.css'
import ScrollDebug from './ScrollDebug'

const AppRouterLayout: React.FC<{
  lang: string
  tableOfContents: StoryToCItem[]
}> = ({ lang, tableOfContents }) => {
  return (
    <>
      <ViewportManager />
      <ScrollDebug />
      <Menu lang={lang} items={tableOfContents} />
      <Outlet />
    </>
  )
}

const App: React.FC<{
  lang: string
  basename: string
  tableOfContents: StoryToCItem[]
  availableLanguages: AvailableLanguage[]
}> = ({ basename, availableLanguages = AvailableLanguages, ...props }) => {
  // const updateSceneStore = useSceneStore((state) => state.update)
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
            children: props.tableOfContents.map((storyTocItem) => ({
              path: storyTocItem.id,
              Component: Story,
              loader: async () => {
                const dataUrl = `${Basename}/data/${storyTocItem.id}.json`
                // return data from here
                console.debug(
                  '[App] loader for story:',
                  storyTocItem.id,
                  '- lang:',
                  lang,
                  dataUrl
                )
                const story: {
                  id: string
                  data: StoryData
                } = await fetch(dataUrl).then((res) => res.json())

                return {
                  id: storyTocItem.id,
                  lang,
                  duration: storyTocItem.duration,
                  data: story.data,
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
