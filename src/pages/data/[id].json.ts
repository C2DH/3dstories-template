import { getCollection } from 'astro:content'
import { AvailableLanguages } from '../../constants'
import type { StoryData } from '../../types'

export async function getStaticPaths() {
  const stories = await getCollection('stories')
  return AvailableLanguages.map((lang) =>
    stories.map((story) => ({
      params: { id: story.id },
      props: {
        story: {
          id: story.id,
          data: story.data as StoryData,
        },
      },
    }))
  ).flat()
}

export async function GET({
  props,
}: {
  props: {
    story: {
      id: string
      data: StoryData
    }
  }
}) {
  if (!props.story) {
    return new Response('Story not found', { status: 404 })
  }
  return new Response(JSON.stringify(props.story, null, 2))
}
