import {ImageContaintingElementType, SanitiseImagesResponse} from 'types'

const imageMap = new Map()

const hideElement = (element: ImageContaintingElementType, isBlur: boolean) => {
  if (isBlur) element.style.filter = 'blur(30px)'
  else element.style.visibility = 'hidden'
}

const showElement = (element: ImageContaintingElementType) => {
  element.style.visibility = 'visible'
  element.style.filter = 'none'
}

const url = 'https://octopus-app-dyhid.ondigitalocean.app/'

const computeImagePredictionScore = async (imageSource: string) => {
  try {
    const res = await fetch('http://localhost:5000/?' + new URLSearchParams({url: imageSource}), {
      method: 'GET',
      headers: {Accept: 'application/json'},
    })
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

export const checkElements = async (imageContainingElements: SanitiseImagesResponse) => {
  const {allImages} = imageContainingElements

  // Hiding all the images first
  for (const img of allImages) {
    hideElement(img.element, true)
  }

  // Computing the score for each image and showing the ones that are safe
  for (const img of allImages) {
    const {src, element} = img

    // TODO: temporarily disabled to avoid API calls on data:image
    if (src.startsWith('data:image')) continue

    if (!imageMap.has(src)) {
      try {
        const score = await computeImagePredictionScore(src)
        imageMap.set(src, score)
      } catch (e) {
        console.log(e, src, element)
      }
    }
    if (imageMap.has(src)) {
      const score = imageMap.get(src)
      if (score < 0.1) showElement(element)
    }
  }
}
