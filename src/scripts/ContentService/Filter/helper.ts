import {DOMImagesResponse, ImageContaintingElementType, SanitiseImagesResponse} from 'types'

const isUnsupportedImage = (imageSource: string) => {
  return (
    imageSource.length === 0 || imageSource.endsWith('.svg') || imageSource.endsWith('.ico')
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
  const resp: SanitiseImagesResponse = {imgs: [], divImages: [], videoPosters: [], allImages: []}

  for (const [key, value] of Object.entries(res)) {
    for (const element of value) {
      const imageSource = getImageSource(element)
      if (isUnsupportedImage(imageSource)) {
        continue
      }
      resp[key].push({src: imageSource, element})
      resp.allImages.push({src: imageSource, element})
    }
  }
  return resp
}
