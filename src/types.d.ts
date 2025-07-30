export interface StoryTableOfContent {
  id: string
  title: string
  ordering: number
  sections: Array<{
    id: string
    title: string
  }>
}
