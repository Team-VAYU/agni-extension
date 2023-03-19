import {
  DOMImagesResponse,
  ImageContaintingElementType,
  MediaType,
  SanitiseImagesResponse,
  SanitiseVideosResponse,
  SanitizeAudioResponse,
} from '../../../types'

const isUnsupportedImage = (imageSource: string) => {
  return (
    imageSource.length === 0 || imageSource.includes('.svg') || imageSource.includes('.ico')
    // || imageSource.startsWith('data:image')
    // TODO: temporarily disabled to avoid API calls on data:image
  )
}

const getImageSource = (element: ImageContaintingElementType) => {
  if (element instanceof HTMLImageElement) {
    return element.currentSrc
  }
  if (element instanceof HTMLDivElement) {
    const urlSrc = element.style.backgroundImage
    return urlSrc.substring(5, urlSrc.length - 2)
  }
  if (element instanceof HTMLVideoElement) {
    return element.poster
  }
  return ''
}

export const sanitizeImagesResponse = (res: DOMImagesResponse): SanitiseImagesResponse => {
  // console.log('sanitising', res)
  const resp: SanitiseImagesResponse = {imgs: [], divImages: [], videoPosters: [], allImages: []}

  for (const [key, value] of Object.entries(res)) {
    for (const element of value) {
      const imageSource = getImageSource(element)
      if (isUnsupportedImage(imageSource)) {
        continue
      }
      resp[key].push({src: imageSource, element})
      resp.allImages.push({src: imageSource, element, type: MediaType.IMAGE})
    }
  }
  return resp
}

export const sanitizeVideosResponse = (res: HTMLVideoElement[]): SanitiseVideosResponse => {
  const resp: SanitiseVideosResponse = {videos: []}

  for (const element of res) {
    const videoSource = element.currentSrc
    if (videoSource.length === 0) {
      continue
    }
    resp.videos.push({src: videoSource, element, type: MediaType.VIDEO})
  }
  return resp
}

export const sanitizeAudioResponse = (res: HTMLAudioElement[]): SanitizeAudioResponse => {
  const resp: SanitizeAudioResponse = {audios: []}

  for (const element of res) {
    const audioSource = element.currentSrc
    if (audioSource.length === 0) {
      continue
    }
    resp.audios.push({src: audioSource, element, type: MediaType.AUDIO})
  }
  return resp
}
