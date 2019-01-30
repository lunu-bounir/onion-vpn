'use strict';

class Events {
  constructor() {
    this.events = {};
  }
  on(name, callback) {
    this.events[name] = this.events[name] || [];
    this.events[name].push(callback);
  }
  emit(name, ...data) {
    (this.events[name] || []).forEach(c => c(...data));
  }
}

class Tor extends Events {
  constructor() {
    super();
    this.instances = {};
    this.commands = navigator.platform.startsWith('Win') ? {
      tor: '.\\tor\\tor.exe',
      killall: 'taskkill /F /IM tor.exe'
    } : {
      tor: './tor',
      killall: 'killall tor'
    };
  }
  connect(socksPort) {
    if (Object.keys(this.instances).length === 0) {
      this.port = chrome.runtime.connectNative('onion.vpn.helper');
      this.port.onMessage.addListener(r => {
        this.emit('message', r);
        if (r.stdout && this.instances[r.id]) {
          if (r.stdout.indexOf('Bootstrapped 100%: Done') !== -1) {
            this.emit('connected', r.id);
          }
          this.instances[r.id].stdout += r.stdout + '\n';
        }
        else if (r.stderr && this.instances[r.id]) {
          this.instances[r.id].stderr += r.stderr + '\n';
        }
        else if ('code' in r && this.instances[r.id]) {
          this.emit('disconnected', [r.id]);
          delete this.instances[r.id];
        }
      });
      this.port.onDisconnect.addListener(() => {
        this.instances = {};
        delete this.port;
        this.emit('terminated');
      });
    }
    this.instances[socksPort] = {
      socksPort,
      stdout: '',
      stderr: ''
    };
    this.port.postMessage({
      method: 'spawn',
      id: socksPort,
      command: this.commands.tor,
      arguments: [
        '--allow-missing-torrc',
        'SocksPort', String(socksPort),
        'GeoIPFile', 'geoip',
        'GeoIPv6File', 'geoip6',
        'DataDirectory', String(socksPort)
      ]
    });
  }
  disconnect(ids) {
    ids.forEach(id => delete this.instances[id]);
    this.emit('disconnected', ids);
    if (Object.keys(this.instances).length === 0) {
      this.port.disconnect();
      delete this.port;
      this.emit('terminated');
    }
    else {
      this.port.postMessage({
        method: 'kill',
        ids
      });
    }
  }
  killall() {
    this.port.postMessage({
      method: 'exec',
      command: this.commands.killall
    });
  }
}


