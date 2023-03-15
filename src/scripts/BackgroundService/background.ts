import {blockedWebsites} from '../../data/blockedWebsites'
import {DOMAction} from '../../types'

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    const url = tab.url
    if (url && blockedWebsites.includes(url)) {
      chrome.tabs.sendMessage(tabId, {type: DOMAction.BLOCKED_WEBSITE})
      return
    }
    // chrome.tabs.sendMessage(tabId, {type: DOMAction.GET_IMAGES})
  }
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === DOMAction.GET_IMAGES) {
    console.log('from background service', request)
  }
})

export {}
