'use strict';

var info = document.getElementById('info');

chrome.storage.local.get({
  ports: [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030],
  badge: true,
  start: false,
  arguments: ''
}, prefs => {
  document.getElementById('ports').value = prefs.ports.join(', ');
  document.getElementById('badge').checked = prefs.badge;
  document.getElementById('start').checked = prefs.start;
  document.getElementById('arguments').value = prefs.arguments;
});

document.getElementById('save').addEventListener('click', () => {
  let ports = document.getElementById('ports').value.split(/\s*,\s*/).filter(s => s && isNaN(s) === false);
  ports = ports.length ? ports : [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
  chrome.storage.local.set({
    ports,
    badge: document.getElementById('badge').checked,
    start: document.getElementById('start').checked,
    arguments: document.getElementById('arguments').value
  }, () => {
    document.getElementById('ports').value = ports.join(', ');
    info.textContent = 'Options saved';
    window.setTimeout(() => info.textContent = '', 750);
  });
});

// reset
document.getElementById('reset').addEventListener('click', e => {
  if (e.detail === 1) {
    info.textContent = 'Double-click to reset!';
    window.setTimeout(() => info.textContent = '', 750);
  }
  else {
    localStorage.clear();
    chrome.storage.local.clear(() => {
      chrome.runtime.reload();
      window.close();
    });
  }
});
// support
document.getElementById('support').addEventListener('click', () => chrome.tabs.create({
  url: chrome.runtime.getManifest().homepage_url + '?rd=donate'
}));
