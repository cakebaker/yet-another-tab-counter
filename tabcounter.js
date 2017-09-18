'use strict';

var tabRemoved = false;

browser.browserAction.setBadgeBackgroundColor({color: "gray"});
browser.tabs.onActivated.addListener(refreshCounter);
browser.tabs.onCreated.addListener(refreshCounter);
browser.tabs.onAttached.addListener(refreshCounter);
browser.tabs.onRemoved.addListener(() => tabRemoved = true);

refreshCounter();

function refreshCounter() {
  browser.tabs.query({currentWindow: true}).then(updateCounter, onError);
}

function updateCounter(tabs) {
  var tabCount = tabs.length;

  // XXX because a removed tab is still part of the "tabs" array at this time, we have to adjust the counter
  if (tabRemoved) {
    tabCount -= 1;
    tabRemoved = false;
  }

  browser.browserAction.setBadgeText({text: tabCount.toString(), tabId: getActiveTabId(tabs)});
}

function getActiveTabId(tabs) {
  return tabs.filter((tab) => tab.active)[0].id;
}

function onError(error) {
  console.log(`Error: ${error}`);
}
