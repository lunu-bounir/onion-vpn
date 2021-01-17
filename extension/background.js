/* globals Tor, Events, browser */
'use strict';

var prefs = {
  ports: [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030],
  threads: 1,
  badge: true,
  start: false,
  native: false,
  arguments: ''
};
chrome.storage.local.get(prefs, ps => {
  Object.assign(prefs, ps);
  const check = () => chrome.runtime.sendNativeMessage('onion.vpn.helper', {
    method: 'echo'
  }, r => {
    chrome.storage.local.set({
      native: r ? true : false
    });
    if (r && prefs.start) {
      app.connect();
    }
    if (!r) {
      chrome.storage.local.set({
        native: false
      });
    }
  });
  chrome.runtime.onStartup.addListener(check);
  chrome.runtime.onInstalled.addListener(check);
  //
  chrome.contextMenus.update('thread-' + prefs.threads, {
    checked: true
  });
});
chrome.storage.onChanged.addListener(ps => {
  Object.keys(ps).forEach(name => prefs[name] = ps[name].newValue);
  if (ps.threads) {
    app.fix();
  }
});

var proxy = {};
proxy.update = () => {
  if (app.connected.length || app.mode === 'connected') {
    const data = `function FindProxyForURL() {
      const ports = ${JSON.stringify(app.connected)};
      if (ports.length) {
        const port = ports[Math.floor(Math.random() * ports.length)];
        return 'SOCKS localhost:' + port;
      }
      else {
        return 'SOCKS localhost:2020';
      }
    }`;
    if (/Firefox/.test(navigator.userAgent)) {
      browser.proxy.settings.clear({}, () => {
        browser.proxy.settings.set({
          value: {
            proxyType: 'autoConfig',
            autoConfigUrl: 'data:text/javascript,' + encodeURIComponent(data),
            proxyDNS: true
          }
        });
      });
    }
    else {
      chrome.proxy.settings.clear({
        scope: 'regular'
      }, () => chrome.proxy.settings.set({
        value: {
          mode: 'pac_script',
          pacScript: {
            data,
            mandatory: true
          }
        },
        scope: 'regular'
      }));
    }
  }
  else {
    chrome.proxy.settings.clear({
      scope: 'regular'
    });
  }
};

var app = new Events();
app.connected = [];
app.ids = [];
app.mode = 'disconnected';

var tor = new Tor();
tor.on('connected', id => {
  if (app.connected.length === 0) {
    app.emit('connected');
  }
  app.connected.push(id);
  app.emit('update');
});
tor.on('disconnected', ids => {
  for (const id of ids) {
    const i = app.ids.indexOf(id);
    if (i !== -1) {
      app.ids.splice(i, 1);
    }
    const j = app.connected.indexOf(id);
    if (j !== -1) {
      app.connected.splice(j, 1);
    }
  }
  if (app.connected.length === 0) {
    app.emit('disconnected');
  }
  else {
    app.emit('update');
  }
});
// tor.on('message', r => app.emit('message', r));

app.connect = port => {
  if (prefs.native === false) {
    app.notify('Native Client is not found. Follow the instruction to install it');
    chrome.windows.create({
      url: chrome.extension.getURL('data/installer/index.html'),
      width: 600,
      height: 450,
      left: screen.availLeft + Math.round((screen.availWidth - 600) / 2),
      top: screen.availTop + Math.round((screen.availHeight - 450) / 2),
      type: 'popup'
    });
    return;
  }
  chrome.proxy.settings.get({}, e => {
    if (e.levelOfControl === 'controllable_by_this_extension' || e.levelOfControl === 'controlled_by_this_extension') {
      app.mode = 'connected';
      if (app.ids.length === 0) {
        app.emit('connecting');
      }
      if (port) {
        app.ids.push(port);
        tor.connect(port, prefs.arguments);
      }
      else {
        for (const port of prefs.ports.slice(0, prefs.threads)) {
          if (port) {
            app.ids.push(port);
            tor.connect(port, prefs.arguments);
          }
          else {
            console.error('no more ports to use');
          }
        }
      }
    }
    else {
      app.notify('Cannot control your browser\'s proxy settings; ' + e.levelOfControl);
    }
  });
};

app.disconnect = (trusted = false) => {
  if (trusted) {
    app.mode = 'disconnected';
  }
  tor.disconnect(app.ids.slice(0));
};

app.fix = () => {
  const len = app.ids.length;
  if (len === prefs.threads) {
    return;
  }
  if (len > prefs.threads) {
    tor.disconnect(app.ids.slice(0, len - prefs.threads));
  }
  else {
    const n = prefs.threads - len;
    const ports = prefs.ports.filter(p => app.ids.indexOf(p) === -1);
    ports.slice(0, n).forEach(port => app.connect(port));
    app.notify('Increasing # of channels by ' + n + '. Please wait...');
  }
};

app.icon = status => {
  app.icon.status = status;
  chrome.browserAction.setIcon({
    path: {
      '16': 'data/icons/' + status + '/16.png',
      '19': 'data/icons/' + status + '/19.png',
      '32': 'data/icons/' + status + '/32.png',
      '38': 'data/icons/' + status + '/38.png',
      '48': 'data/icons/' + status + '/48.png',
      '64': 'data/icons/' + status + '/64.png'
    }
  });
};
app.icon.status = 'disconnected';
app.icon.toggle = () => {
  app.icon(app.icon.status === 'disconnected' ? 'connecting' : 'disconnected');
};

app.title = title => chrome.browserAction.setTitle({
  title
});

app.badge = text => prefs.badge && chrome.browserAction.setBadgeText({
  text
});

app.notify = message => chrome.notifications.create({
  title: chrome.runtime.getManifest().name,
  message,
  type: 'basic',
  iconUrl: 'data/icons/connected/48.png'
});

var timer;
app.on('connecting', () => {
  app.title(`Connecting to the Tor network (${prefs.threads} channels)`);
  app.icon('connecting');
  window.clearInterval(timer);
  timer = window.setInterval(app.icon.toggle, 500);
  proxy.update();
});
app.on('connected', () => {
  window.clearInterval(timer);
  app.icon('connected');
});
app.on('update', () => {
  app.title(`Connected to the Tor network (${app.connected.length} channels)`);
  app.badge(app.connected.length ? String(app.connected.length) : '');
  proxy.update();
});
app.on('disconnected', () => {
  window.clearInterval(timer);
  app.title('Disconnected from the Tor network');
  app.icon(app.mode === 'disconnected' ? 'disconnected' : 'unexpected');
  app.badge('');
  proxy.update();
  if (app.mode === 'connected') {
    app.notify('All Tor instances are exited unexpectedly. To protect your privacy, proxy is NOT being released. Use the toolbar button to reconnect');
  }
});

chrome.browserAction.onClicked.addListener(() => {
  if (app.ids.length) {
    app.disconnect(true);
  }
  else {
    app.connect();
  }
});

chrome.browserAction.setBadgeBackgroundColor({
  color: '#7d4798'
});

{
  const {onInstalled, setUninstallURL, getManifest} = chrome.runtime;
  const {name, version} = getManifest();
  const page = getManifest().homepage_url;
  onInstalled.addListener(({reason, previousVersion}) => {
    chrome.storage.local.get({
      'faqs': true,
      'last-update': 0
    }, prefs => {
      if (reason === 'install' || (prefs.faqs && reason === 'update')) {
        const doUpdate = (Date.now() - prefs['last-update']) / 1000 / 60 / 60 / 24 > 45;
        if (doUpdate && previousVersion !== version) {
          chrome.tabs.create({
            url: page + '?version=' + version +
              (previousVersion ? '&p=' + previousVersion : '') +
              '&type=' + reason,
            active: reason === 'install'
          });
          chrome.storage.local.set({'last-update': Date.now()});
        }
      }
    });
  });
  setUninstallURL(page + '?rd=feedback&name=' + encodeURIComponent(name) + '&version=' + version);
}
