export enum DOMAction {
  GET_DOM = 'GET_DOM',
  GET_IMAGES = 'GET_IMAGES',
  BLOCKED_WEBSITE = 'BLOCKED_WEBSITE',
}

export type DOMResponse = {
  title: string
  images: string[] | any
  text: string[] | any
  audio: string[] | any
  video: string[] | any
}

export type DOMImagesResponse = {
  imgs: HTMLImageElement[]
  divImages: HTMLDivElement[]
  videoPosters: HTMLVideoElement[]
}

export type ImageContaintingElementType = HTMLImageElement | HTMLDivElement | HTMLVideoElement

export type DOMResponseType = DOMResponse | DOMImagesResponse
