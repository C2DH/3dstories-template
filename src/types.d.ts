import type { AvailableLanguage } from './constants'

export interface StorySection {
  title: {
    [key in AvailableLanguage]: string
  }
  content?: {
    [key in AvailableLanguage]: string
  }
}

export interface StorySettings {
  scene: string // Path to the scene component
  sheet?: string // Optional path to the Theatre.js project data JSON file
}
// StoryData describes the astro js content `data` property.
export interface StoryData {
  title: {
    [key in AvailableLanguage]: string
  }
  content?: {
    [key in AvailableLanguage]: string
  }
  duration?: number // Duration in seconds
  ordering?: number // Optional ordering for the story
  sections: StorySection[]
  settings: StorySettings
}

export interface StorySectionToCItem {
  id: string // Unique identifier for the section, generated using the story ID + section index
  title: {
    [key in AvailableLanguage]: string
  }
}

export interface StoryToCItem {
  id: string // Unique identifier for the story (the astro js id property)
  title: {
    [key in AvailableLanguage]: string
  }
  duration: number // Duration in seconds
  ordering: number // Optional ordering for the story
  sections: Array<StorySectionToCItem>
  settings: StorySettings
}
