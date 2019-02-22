const { ipcRenderer } = require("electron");

window.start = function() {
  ipcRenderer.send("navigate:start");
};

window.stop = function() {
  ipcRenderer.send("navigate:stop");
};
