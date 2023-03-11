import {DOMAction, DOMImagesResponse} from '../types'

const messagesFromReactAppListener = (
  msg: {type: DOMAction},
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: DOMImagesResponse) => void,
) => {
  console.log('[content.js]. Message received', msg)
  const type = msg.type
  switch (type) {
    case DOMAction.GET_DOM:
      const response: DOMImagesResponse = {
        title: DOMAction.GET_DOM,
        video: Array.from(document.querySelectorAll<'video'>('video')).map(video => video.src),
        audio: Array.from(document.querySelectorAll<'audio'>('audio')).map(audio => audio.src),
        images: Array.from(document.querySelectorAll<'img'>('img')).map(img => img),
        text: Array.from(document.getElementsByTagName<'p'>('p')).map(p => p.innerText),
      }
      console.log('[content.js]. Message response', response)
      sendResponse(response)
      break
    case DOMAction.BLOCKED_WEBSITE:
      document.body.innerHTML = 'Blocked website'
      break
    default:
      console.log('default')
      break
  }
}

console.log('hello from content script test')

/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(messagesFromReactAppListener)
