import {DOMAction, DOMResponse, DOMResponseType} from '../../types'
import {checkElements} from './Filter/filter'
import {sanitizeImagesResponse} from './Filter/helper'
import {watchDOM} from './ObserveDOM'

const messagesFromReactAppListener = (
  msg: {type: DOMAction},
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: DOMResponseType) => void,
) => {
  const type = msg.type
  switch (type) {
    // case DOMAction.GET_DOM:
    //   const response: DOMResponse = {
    //     title: DOMAction.GET_DOM,
    //     video: Array.from(document.querySelectorAll<'video'>('video')).map(video => video.src),
    //     audio: Array.from(document.querySelectorAll<'audio'>('audio')).map(audio => audio.src),
    //     images: Array.from(document.querySelectorAll<'img'>('img')).map(img => img),
    //     text: Array.from(document.getElementsByTagName<'p'>('p')).map(p => p.innerText),
    //   }
    //   sendResponse(response)
    //   break
    // case DOMAction.GET_IMAGES:
    //   // Get all images from img tags, div with background image, and video poster
    //   const imgs = Array.from(document.querySelectorAll<'img'>('img'))
    //   const divImages = Array.from(document.querySelectorAll<'div'>('div')).filter(
    //     div => div.style.backgroundImage,
    //   )
    //   const videoPosters = Array.from(document.querySelectorAll<'video'>('video')).filter(
    //     video => video.poster,
    //   )
    //   const res = {imgs, divImages, videoPosters}
    //   const sanitizedRes = sanitizeImagesResponse(res)

    //   checkElements(sanitizedRes)
    //   break
    case DOMAction.BLOCKED_WEBSITE:
      // add inner html for blocked website template including css
      document.body.innerHTML = `
      <div class="blocked-website">
        <h1>Blocked Website</h1>
        <p>Sorry, this website has been blocked by your admin.</p>
      </div>
    `
      const style = document.createElement('style')
      style.innerHTML = `
      .blocked-website {
        display: flex;  
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100vw;
        background-color: #f5f5f5;
      }
      .blocked-website h1 {
        font-size: 3rem;
        font-weight: 500;
        color: maroon;
      }


      .blocked-website p {
        font-size: 1.5rem;
        font-weight: 400;
        color: #000;
      }
    `
      document.head.appendChild(style)
      break
    default:
      break
  }
}

console.log('hello from content script test')

/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(messagesFromReactAppListener)

watchDOM()
