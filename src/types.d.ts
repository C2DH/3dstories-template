export interface StorySection {
  id: string
  title: string
  content?: string
}

export interface StoryTableOfContent extends StorySection {
  ordering: number
  sections: Array<StorySection>
}
