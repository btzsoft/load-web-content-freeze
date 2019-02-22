const { app, BrowserWindow, ipcMain } = require("electron");

let mainWindow;

function navigateTo(url, cb) {
  const win = new BrowserWindow({
    show: false
  });
  const handler = () => {
    win.webContents.removeListener("did-finish-load", handler);
    win.close();
    cb();
  };
  win.webContents.on("did-finish-load", handler);
  win.webContents.loadURL(url);
}

function navigateWebPages() {
  const maxToNavigate = 10000;
  const parallelCount = 30;
  let checkInterval;
  let openPagesCount = 0;
  let navigatedPagesCount = 0;

  const start = () => {
    checkInterval = setInterval(() => {
      if (navigatedPagesCount === maxToNavigate) {
        return stop();
      }
      if (openPagesCount < parallelCount) {
        const url = `http://example.com/test/it-is-time/${Date.now()}`;
        navigateTo(url, () => {
          openPagesCount--;
          console.log("Navigated to:", url);
        });
        openPagesCount++;
        console.log("Open now:", openPagesCount);
      }
    }, 9.99);
  };

  const stop = () => {
    clearInterval(checkInterval);
  };

  ipcMain.on("navigate:start", start);
  ipcMain.on("navigate:stop", stop);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.loadFile("index.html");
  mainWindow.on("closed", function() {
    mainWindow = null;
  });

  navigateWebPages();
}

app.on("ready", createWindow);
app.on("window-all-closed", function() {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  if (mainWindow === null) {
    createWindow();
  }
});
