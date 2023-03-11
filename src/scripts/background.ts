import {blockedWebsites} from '../data/blockedWebsites'
console.log('from background service')

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    const url = tab.url
    console.log(tab)
    if (url && blockedWebsites.includes(url)) {
      chrome.tabs.sendMessage(tabId, {type: 'BLOCKED_WEBSITE'})
    }
  }
})

export {}
