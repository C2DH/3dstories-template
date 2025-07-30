import { defineCollection, reference, z } from 'astro:content'
import { glob } from 'astro/loaders'
import { AvailableLanguages } from './constants'

const localizedZodObject = (baseSchema: z.ZodTypeAny) => {
  return z.object(
    AvailableLanguages.reduce((acc, lang) => {
      acc[lang] = baseSchema
      return acc
    }, {} as Record<(typeof AvailableLanguages)[number], z.ZodTypeAny>)
  )
}

const stories = defineCollection({
  loader: glob({ pattern: '*.yaml', base: `./src/content/stories` }),
  schema: z.object({
    title: localizedZodObject(z.string().min(2).max(100)),
    content: localizedZodObject(z.string().min(2).max(1000)),
    ordering: z.number().int().min(0).max(1000).optional(),
    sections: z.array(
      z.object({
        title: localizedZodObject(z.string().min(2).max(100)),
        content: localizedZodObject(z.string().min(10)),
      })
    ),
  }),
})

export const collections = {
  stories,
}
