import type { AvailableLanguage } from './constants'

export interface StorySection {
  id: string
  title: {
    [key in AvailableLanguage]: string
  }
  content?: {
    [key in AvailableLanguage]: string
  }
  sections?: StorySection[]
}

export interface StoryTableOfContent extends StorySection {
  data?: any
  ordering: number
  sections: Array<StorySection>
}
