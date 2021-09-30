const {
    contextBridge,
    ipcRenderer
} = require("electron");

const {
  TO_GENERAL,
  FROM_GENERAL,
} = require("./const");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  "api", {
    send: (channel, data) => {
      // whitelist channels
      let validChannels = [TO_GENERAL];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    receive: (channel, func) => {
      let validChannels = [FROM_GENERAL];
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, func);
      }
    },
    removeListener: (channel, func) => {
      ipcRenderer.removeAllListeners(channel, func);
    }
  }
);