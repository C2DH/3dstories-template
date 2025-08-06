import { defineCollection, reference, z } from 'astro:content'
import { glob } from 'astro/loaders'
import { AvailableLanguages } from './constants'

const localizedZodObject = (baseSchema: z.ZodTypeAny) => {
  return z.object(
    AvailableLanguages.reduce(
      (acc, lang) => {
        acc[lang] = baseSchema
        return acc
      },
      {} as Record<(typeof AvailableLanguages)[number], z.ZodTypeAny>
    )
  )
}

const stories = defineCollection({
  loader: glob({ pattern: '*.yaml', base: `./src/content/stories` }),
  schema: z.object({
    title: localizedZodObject(z.string().min(2).max(100)),
    excerpt: localizedZodObject(z.string().min(10).max(200)),
    content: localizedZodObject(z.string().min(2).max(1000)),
    ordering: z.number().int().min(0).max(1000).optional(),
    duration: z.number().int().min(1).max(1000).optional().default(10),
    sections: z.array(
      z.object({
        title: localizedZodObject(z.string().min(2).max(100)),
        content: localizedZodObject(z.string().min(10)),
      })
    ),
    footer: z
      .object({
        title: localizedZodObject(z.string().max(100)),
        content: localizedZodObject(z.string().max(500)),
        additionalLinks: z
          .array(
            z.object({
              url: z.string().url(),
              title: localizedZodObject(z.string().max(100)),
            })
          )
          .optional(),
      })
      .optional(),
    settings: z.object({
      // Scene component path inside component/scenes. This component is responsible of
      // displaying the objects. See src/components/scenes/README.md to check
      // what is needed there.
      // Note that model files should be placed in src/components/models
      // and imported in the scene component.
      // The scene component should be a React component that uses the Theatre.js API
      // to control the animation of the objects.
      scene: z.string(),
      // relative path to the `public/scene` folder, it contains the sheets JSON is availble.
      // The sheet is a JSON file that contains the Theatre.js project data.
      // if there is no sheet, the scene component use Theatre.js local database, named
      // after the story identifier.
      state: z.string().optional(),
      editable: z.boolean().optional().default(true),
    }),
  }),
})

export const collections = {
  stories,
}
