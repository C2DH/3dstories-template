import { createBrowserRouter, Outlet, RouterProvider } from 'react-router'
import ViewportManager from './ViewportManager'
import Menu from './Menu'
import type { StoryTableOfContent } from '../types'
import { AvailableLanguages } from '../constants'

const AppRouterLayout: React.FC<{
  lang: string
  tableOfContents: StoryTableOfContent[]
}> = ({ lang, tableOfContents }) => {
  return (
    <>
      <ViewportManager />

      <Menu lang={lang} items={tableOfContents} />
      <Outlet />
    </>
  )
}

const App: React.FC<{
  lang: string
  basename: string
  tableOfContents: StoryTableOfContent[]
  availableLanguages: string[]
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
              element: null,
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
