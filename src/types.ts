export enum DOMAction {
  GET_DOM = 'GET_DOM',
  BLOCKED_WEBSITE = 'BLOCKED_WEBSITE',
}

export type DOMImagesResponse = {
  title: string
  images: string[] | any
  text: string[] | any
  audio: string[] | any
  video: string[] | any
}
