import { getCollection } from 'astro:content'
import { AvailableLanguages } from '../../constants'

export async function getStaticPaths() {
  const stories = await getCollection('stories')
  return AvailableLanguages.map((lang) =>
    stories.map((story) => ({
      params: { id: story.id, lang },
      props: { story },
    }))
  ).flat()
}

export async function GET({ props }: { props: { story: { data: any } } }) {
  if (!props.story) {
    return new Response('Story not found', { status: 404 })
  }
  console.log('Fetching stories...', props)
  return new Response(JSON.stringify(props.story.data, null, 2))
}
