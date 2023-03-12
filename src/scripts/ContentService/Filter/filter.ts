import {DOMImagesResponse, ImageContaintingElementType} from 'types'

const imageMap = new Map()

const hideElement = (element: ImageContaintingElementType, isBlur: boolean) => {
  if (isBlur) element.style.filter = 'blur(30px)'
  else element.style.visibility = 'hidden'
}

const showElement = (element: ImageContaintingElementType) => {
  element.style.visibility = 'visible'
  element.style.filter = 'none'
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
  return null
}

const url = 'https://octopus-app-dyhid.ondigitalocean.app/'

const computeImagePredictionScore = async (imageSource: string) => {
  try {
    const res = await fetch(
      'http://localhost:5000/?' +
        new URLSearchParams({
          url: imageSource,
        }),
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      },
    )
    const data = await res.json()
    if (data.error_code) {
      throw new Error(data.error_reason)
    } else {
      return data.score
    }
  } catch (e) {
    throw new Error('Something went wrong')
  }
}

export const checkElements = async (imageContainingElements: DOMImagesResponse) => {
  for (const key in imageContainingElements) {
    const elements = imageContainingElements[key]
    for (const element of elements) {
      const imageSource = getImageSource(element)
      console.log('imageSource', imageSource)
      if (!imageSource) continue

      hideElement(element, true)
      if (!imageMap.has(imageSource)) {
        try {
          console.log(element)
          const score = await computeImagePredictionScore(imageSource)
          // predict random score between 0 and 1
          // const score = Math.random()
          console.log(score, imageSource, element)
          imageMap.set(imageSource, score)
        } catch (e) {
          console.log(e)
        }
      }
      if (imageMap.has(imageSource)) {
        const score = imageMap.get(imageSource)
        if (score < 0.1) {
          showElement(element)
        }
      }
    }
  }
}
