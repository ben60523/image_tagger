const {
  app, BrowserWindow, ipcMain, Menu,
} = require('electron');
const electronShortcut = require('electron-localshortcut');
const electronReload = require('electron-reload');

const winston = require('winston');
const Datastore = require('nedb');

const path = require('path');
const URL = require('url');
const isDev = require('electron-is-dev');

const controller = require('./controllers/controller');
const mainController = require('./controllers/main_controller');
const appMenu = require('./menu');

const {
  TO_MAIN,
  FROM_MAIN,
  TO_GENERAL,
  DB_PATH,
  PROJECT_COLLECTION,
  APP_PATH,
} = require('./const');

/**
 * When in development mode:
 * - Enable automatic reloads
 */
if (isDev) {
  electronReload(path.join(__dirname, '../'), {
    // Note that the path to electron may vary according to the main file
    electron: path.join(__dirname, '../', './node_modules/electron'),
  });
}

app.setName(`${app.getName()}_${app.getVersion()}`);
app.setAppLogsPath(path.join(app.getPath('logs').replace('Electron', ''), app.getName()));

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: path.join(app.getPath('logs'), 'media_tagger_main.json'),
    }),
  ],
});

const db = {};

db.project = new Datastore({
  filename: path.join(app.getPath(APP_PATH), DB_PATH, PROJECT_COLLECTION),
  autoload: true,
});

function createWindow() {
  // Path to root directory.
  const basePath = isDev ? path.resolve(__dirname, '../') : app.getAppPath();

  // Create the browser window.
  const win = new BrowserWindow({
    title: app.name,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.resolve(basePath, './build/preload.js'),
    },
  });

  // URL for index.html which will be our entry point.
  const indexURL = URL.format({
    pathname: path.resolve(basePath, './build/index.html'),
    protocol: 'file:',
    slashes: true,
  });

  // and load the index.html of the app.
  win.loadURL(indexURL);

  win.maximize();
  win.show();

  win.on('close', () => {
    if (win) {
      // e.preventDefault();
      win.webContents.send(FROM_MAIN, 'app-close');
    }
  });

  // Register the shortcut for windows version
  electronShortcut.register(win, 'F12', () => {
    win.toggleDevTools();
  });

  // Loadind Menu
  if (!isDev) {
    Menu.setApplicationMenu(Menu.buildFromTemplate(appMenu()));
  }

  // ipc connection
  ipcMain.on(TO_MAIN, (e, props) => {
    mainController({
      win,
      db: db.project,
      props,
    });
  });

  ipcMain.on(TO_GENERAL, (e, props) => {
    // console.log(props);
    controller({
      win,
      app,
      db,
      props,
      logger,
    });
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
