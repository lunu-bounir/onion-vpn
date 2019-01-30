var name;
var os;

(() => {
  if (navigator.platform.startsWith('Mac')) {
    os = 'mac';
    name = 'mac.zip';
  }
  else if (navigator.platform.startsWith('Win')) {
    os = 'windows';
    if (navigator.userAgent.indexOf('WOW64') != -1 || navigator.userAgent.indexOf('Win64') != -1) {
      name = 'win_64.zip';
    }
    else {
      name = 'win_32.zip';
    }
  }
  else {
    os = 'linux';
    name = 'linux_64.zip';
  }
})();
const url = 'https://github.com/lunu-bounir/onion-helper/releases/download/0.1.0/' + name;

if (navigator.platform.startsWith('Mac') || navigator.platform.startsWith('Win')) {
  document.getElementById('package').href = url;
  document.getElementById('package').download = name;
  document.getElementById('uninstall').textContent = 'uninstall.' + (os === 'windows' ? 'bat' : 'sh');
}
else {
  alert('Your operating system is not yet supported');
}

fetch('https://api.github.com/repos/lunu-bounir/onion-helper/releases/latest').then(r => r.json()).then(obj => {
  const link = obj.assets.filter(a => a.name === name)[0].browser_download_url;
  console.log(link);
  document.getElementById('package').href = link;
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
