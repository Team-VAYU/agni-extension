import {checkElements} from './Filter/filter'
import {sanitizeImagesResponse} from './Filter/helper'

const config = {
  characterData: false,
  subtree: true,
  childList: true,
  attributes: true,
  attributeFilter: ['src'],
}

const imageMutation = (element: HTMLElement) => {
  const imgs = Array.from(element.querySelectorAll<'img'>('img'))
  const divImages = Array.from(element.querySelectorAll<'div'>('div')).filter(
    div => div.style.backgroundImage,
  )
  const videoPosters = Array.from(element.querySelectorAll<'video'>('video')).filter(
    video => video.poster,
  )

  const res = {imgs, divImages, videoPosters}
  const sanitizedRes = sanitizeImagesResponse(res)
  checkElements(sanitizedRes)
}

function callback(mutationsList: MutationRecord[]) {
  for (let i = 0; i < mutationsList.length; i++) {
    const mutation = mutationsList[i]
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      imageMutation(mutation.target as HTMLElement)
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
