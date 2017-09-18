'use strict';

var tabRemoved = false;

browser.browserAction.setBadgeBackgroundColor({color: "gray"});
browser.tabs.onActivated.addListener(refreshCounter);
browser.tabs.onRemoved.addListener(() => tabRemoved = true);

initCounter();

function initCounter() {
  browser.tabs.query({currentWindow: true}).then(tabs => updateCounter(getActiveTabId(tabs), tabs), onError);
}

function refreshCounter(tabInfo) {
  browser.tabs.query({windowId: tabInfo.windowId}).then(tabs => updateCounter(tabInfo.tabId, tabs), onError);
}

function updateCounter(tabId, tabs) {
  var tabCount = tabs.length;

  // XXX because a removed tab is still part of the "tabs" array at this time, we have to adjust the counter
  if (tabRemoved) {
    tabCount -= 1;
    tabRemoved = false;
  }

  browser.browserAction.setBadgeText({text: tabCount.toString(), tabId: tabId});
}

function getActiveTabId(tabs) {
  return tabs.filter(tab => tab.active)[0].id;
}

function onError(error) {
  console.log(`Error: ${error}`);
}
