import {ImageContaintingElementType, SanitiseImagesResponse} from 'types'

const imageSet = new Set()
const requestAPIMap = new Map()

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
    const res = await fetch('http://localhost:5000/classify', {
      method: 'POST',
      body: JSON.stringify({url: imageSource}),
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
  // console.log('imageContainingElements', imageContainingElements)
  console.log('imageMap ye raha', imageSet)

  const {allImages} = imageContainingElements
  // console.log('allImages', allImages)

  // Computing the score for each image and showing the ones that are safe
  for (const img of allImages) {
    const {src, element} = img

    if (!imageSet.has(src)) {
      hideElement(element, true)
      imageSet.add(src)
      computeImagePredictionScore(src)
        .then(score => {
          if (score < 0.1) showElement(element)
        })
        .catch(e => {
          console.log(e, element)
        })
    }
  }
}
