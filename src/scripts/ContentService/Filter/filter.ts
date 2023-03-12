import {DOMImagesResponse, ImageContaintingElementType} from 'types'

const imageMap = new Map()

const hideElement = (element: ImageContaintingElementType) => {
  element.style.visibility = 'hidden'
}

const showElement = (element: ImageContaintingElementType) => {
  element.style.visibility = 'visible'
}

const getImageSource = (element: ImageContaintingElementType) => {
  if (element instanceof HTMLImageElement) {
    return element.src
  }
  if (element instanceof HTMLDivElement) {
    return element.style.backgroundImage
  }
  if (element instanceof HTMLVideoElement) {
    return element.poster
  }
  return null
}

const computeImagePredictionScore = async (imageSource: string) => {
  try {
    const res = await fetch(`/?url=${imageSource}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
    const data = await res.json()
    if (data.error_code) {
      throw new Error(data.error_reason)
    } else {
      return data.score
    }
  } catch (e) {
    console.log(e)
    throw new Error('Something went wrong')
  }
}

export const checkElements = async (imageContainingElements: DOMImagesResponse) => {
  for (const key in imageContainingElements) {
    const elements = imageContainingElements[key]
    for (const element of elements) {
      const imageSource = getImageSource(element)

      if (!imageSource) return null

      hideElement(element)
      if (!imageMap.has(imageSource)) {
        try {
          console.log(element)
          const score = await computeImagePredictionScore(imageSource)
          console.log(score, imageSource, element)
          imageMap.set(imageSource, score)
        } catch (e) {
          return null
        }
      }
      const score = imageMap.get(imageSource)
      if (score < 0.1) {
        showElement(element)
      }
    }
  }
}
