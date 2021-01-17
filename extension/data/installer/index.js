var filename;
var os;

(() => {
  if (navigator.platform.startsWith('Mac')) {
    os = 'mac';
    filename = 'mac.zip';
  }
  else if (navigator.platform.startsWith('Win')) {
    os = 'windows';
    if (navigator.userAgent.indexOf('WOW64') != -1 || navigator.userAgent.indexOf('Win64') != -1) {
      filename = 'win_64.zip';
    }
    else {
      filename = 'win_32.zip';
    }
  }
  else {
    os = 'linux';
    filename = 'linux_64.zip';
  }
})();
document.body.dataset.os = os;
const url = 'https://github.com/lunu-bounir/onion-vpn/releases/download/0.1.0/' + filename;

if (navigator.platform.startsWith('Mac') || navigator.platform.startsWith('Win')) {
  document.getElementById('package').dataset.href = url;
  document.getElementById('uninstall').textContent = 'uninstall.' + (os === 'windows' ? 'bat' : 'sh');
}
else {
  alert('Your operating system is not yet supported');
}

fetch('https://api.github.com/repos/lunu-bounir/onion-vpn/releases/latest').then(r => r.json()).then(obj => {
  const link = obj.assets.filter(a => a.name === filename)[0].browser_download_url;
  document.getElementById('package').dataset.href = link;
}).catch(e => alert(e.message));

chrome.runtime.sendNativeMessage('onion.vpn.helper', {
  method: 'read'
}, r => {
  chrome.runtime.lastError;
  if (r) {
    document.getElementById('installed').style.display = 'flex';
  }
});
document.getElementById('restart').addEventListener('click', () => {
  chrome.runtime.reload();
});

document.getElementById('package').addEventListener('click', e => {
  chrome.downloads.download({
    url: e.target.dataset.href,
    filename
  });
  e.preventDefault();
  e.target.parentElement.style['text-decoration'] = 'line-through';
  chrome.runtime.getBackgroundPage(b => b.app.notify('Please wait for the download to finish'));
});
