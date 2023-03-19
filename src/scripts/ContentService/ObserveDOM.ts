import {checkElements} from './Filter/filter'
import {
  sanitizeAudioResponse,
  sanitizeImagesResponse,
  sanitizeVideosResponse,
} from './Filter/helper'

const config = {
  characterData: false,
  subtree: true,
  childList: true,
  attributes: true,
  attributeFilter: ['src'],
}

const domElementsMutation = (element: HTMLElement) => {
  const imgs = Array.from(element.querySelectorAll<'img'>('img'))
  const divImages = Array.from(element.querySelectorAll<'div'>('div')).filter(
    div => div.style.backgroundImage,
  )
  const videoPosters = Array.from(element.querySelectorAll<'video'>('video')).filter(
    video => video.poster,
  )
  const videos = Array.from(element.querySelectorAll<'video'>('video'))
  const audios = Array.from(element.querySelectorAll<'audio'>('audio'))
  console.log('audios', audios)

  const res = {imgs, divImages, videoPosters}
  const sanitizedImageResponse = sanitizeImagesResponse(res)
  const sanitizedVideosResponse = sanitizeVideosResponse(videos)
  const sanitizedAudioResponse = sanitizeAudioResponse(audios)
  checkElements(sanitizedImageResponse, sanitizedVideosResponse, sanitizedAudioResponse)
}

function callback(mutationsList: MutationRecord[]) {
  for (let i = 0; i < mutationsList.length; i++) {
    const mutation = mutationsList[i]
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      domElementsMutation(mutation.target as HTMLElement)
    } else if (mutation.type === 'attributes') {
      if ((mutation.target as HTMLImageElement).nodeName === 'IMG') {
        const res = {imgs: [mutation.target as HTMLImageElement], divImages: [], videoPosters: []}
        const sanitizedRes = sanitizeImagesResponse(res)
        checkElements(sanitizedRes)
      }
    }
  }
}

const observer = new MutationObserver(callback)

export const watchDOM = () => {
  observer.observe(document, config)
}
