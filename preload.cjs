const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopAuth', {
    startGoogleLogin: () => ipcRenderer.invoke('desktop-auth:start'),
});
