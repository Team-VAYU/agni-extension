import {
  CustomElementType,
  MediaType,
  SanitiseImagesResponse,
  SanitiseVideosResponse,
  SanitizeAudioResponse,
} from '../../../types'

import {urlDomains} from '../../../constants'

const sourceSet = new Set()

const hideElement = (element: CustomElementType, isBlur: boolean, type: MediaType) => {
  if (type === MediaType.IMAGE) {
    if (isBlur) element.style.filter = 'blur(30px)'
    else element.style.visibility = 'hidden'
  } else if (type === MediaType.VIDEO || type === MediaType.AUDIO) {
    const video = element as HTMLVideoElement
    video.src = ''
  }
}

const showElement = (element: CustomElementType) => {
  element.style.visibility = 'visible'
  element.style.filter = 'none'
}

// const url = 'https://octopus-app-dyhid.ondigitalocean.app/'
const url = 'https://graphics-obscenity-dulvw.ondigitalocean.app/classify'
const localurl = 'http://localhost:5000/classify'

const computePrediction = async (source: string, type: MediaType) => {
  try {
    const domainUrl = urlDomains[type]
    const res = await fetch(`${domainUrl}/classify`, {
      method: 'POST',
      body: JSON.stringify({url: source, type}),
    })
    const data = await res.json()
    if (data.error_code) {
      throw new Error(data.error_reason)
    } else {
      return data
    }
  } catch (e) {
    throw new Error('Something went wrong')
  }
}

export const checkElements = async (
  imageContainingElements: SanitiseImagesResponse,
  videoContainingElements: SanitiseVideosResponse = {videos: []},
  audioContainingElements: SanitizeAudioResponse = {audios: []},
) => {
  // console.log('imageContainingElements', imageContainingElements)
  console.log('sourceSet ye raha', sourceSet)

  const {allImages} = imageContainingElements
  const {videos} = videoContainingElements
  const {audios} = audioContainingElements
  const allElements = [...allImages, ...videos, ...audios]
  // Computing the score for each image/video and showing the ones that are safe
  for (const el of allElements) {
    const {src, element, type} = el
    const isImage = type === MediaType.IMAGE
    console.log('upar')
    if (!sourceSet.has(src)) {
      if (isImage) hideElement(element, true, type)

      sourceSet.add(src)
      computePrediction(src, type)
        .then(({score, flagged}) => {
          if (isImage) {
            if (score < 0.1) showElement(element)
          } else {
            if (flagged) hideElement(element, true, type)
          }
        })
        .catch(e => {
          console.log(e, element)
        })
    } else {
      const score = sourceSet[src]
      console.log('idhar', score)
      if (score > 0.1) hideElement(element, true, type)
    }
  }
}
