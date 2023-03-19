export enum DOMAction {
  GET_DOM = 'GET_DOM',
  GET_IMAGES = 'GET_IMAGES',
  BLOCKED_WEBSITE = 'BLOCKED_WEBSITE',
}

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
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
export type CustomElementType =
  | HTMLImageElement
  | HTMLDivElement
  | HTMLVideoElement
  | HTMLAudioElement

export type DOMResponseType = DOMResponse | DOMImagesResponse

export interface SanitiseImagesResponse {
  imgs: {src: string; element: HTMLImageElement}[]
  divImages: {src: string; element: HTMLDivElement}[]
  videoPosters: {src: string; element: HTMLVideoElement}[]
  allImages: {src: string; element: ImageContaintingElementType; type: MediaType.IMAGE}[]
}

export interface SanitiseVideosResponse {
  videos: {src: string; element: HTMLVideoElement; type: MediaType.VIDEO}[]
}

export interface SanitizeAudioResponse {
  audios: {src: string; element: HTMLAudioElement; type: MediaType.AUDIO}[]
}

export type SanitizeResponse = SanitiseImagesResponse | SanitiseVideosResponse
