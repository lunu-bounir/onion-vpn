/* globals tor */
'use strict';

chrome.contextMenus.create({
  title: 'Check Connection Status',
  id: 'validate',
  contexts: ['browser_action']
});
const parentId = chrome.contextMenus.create({
  title: 'Number of Tor Connections',
  contexts: ['browser_action']
});
chrome.contextMenus.create({
  title: '1 Connection',
  contexts: ['browser_action'],
  parentId,
  id: 'thread-1',
  type: 'radio'
});
chrome.contextMenus.create({
  title: '2 Connections',
  contexts: ['browser_action'],
  parentId,
  id: 'thread-2',
  type: 'radio'
});
chrome.contextMenus.create({
  title: '3 Connections',
  contexts: ['browser_action'],
  parentId,
  id: 'thread-3',
  type: 'radio'
});
chrome.contextMenus.create({
  title: '4 Connections',
  contexts: ['browser_action'],
  parentId,
  id: 'thread-4',
  type: 'radio'
});
chrome.contextMenus.create({
  title: '5 Connections',
  contexts: ['browser_action'],
  parentId,
  id: 'thread-5',
  type: 'radio'
});
chrome.contextMenus.create({
  title: 'Kill all Running Tor Instances',
  id: 'killall',
  contexts: ['browser_action']
});

chrome.contextMenus.onClicked.addListener(info => {
  if (info.menuItemId === 'validate') {
    chrome.tabs.create({
      url: 'https://check.torproject.org/'
    });
  }
  else if (info.menuItemId.startsWith('thread-')) {
    chrome.storage.local.set({
      threads: Number(info.menuItemId.replace('thread-', ''))
    });
  }
  else if (info.menuItemId === 'killall') {
    tor.killall();
  }
});
