'use strict'
import { app, protocol, BrowserWindow, Tray, Menu, shell, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import checkUpdate from './utils/checkUpdate'
const remoteMain = require('@electron/remote/main')
const isPackaged = app.isPackaged
// 用户路径
// const ___ = app.getPath('userData')
// console.log(___)

remoteMain.initialize()
const isDevelopment = process.env.NODE_ENV !== 'production'
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

function setMenu(mainWindow) {
  const Package = require('/package.json')
  const template = [
    {
      label: '操作',
      submenu: [
        {
          type: 'separator'
        },
        {
          label: '撤销',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        },
        {
          label: '恢复',
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          label: '全选',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectAll'
        },
        {
          label: '复制',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        },
        {
          label: '粘贴',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
        },
        {
          label: '剪切',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut'
        },
      ]
    }
  ]
  if (!isPackaged) {
    template[0].submenu.unshift({
      label: '刷新',
      accelerator: 'CmdOrCtrl+R',
      role: 'reload'
    })
  }
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        {
          label: `版本信息：v${Package.version}`,
          enabled: false
        },
        {
          type: 'separator'
        },
        {
          label: '打开控制台',
          accelerator: 'F12',
          click () {
            mainWindow.webContents.openDevTools()
          }
        },
        {
          type: 'separator'
        },
        {
          label: '访问网页端',
          click () {
            shell.openExternal('https://tit1e.github.io/kindle2Flomo/')
          }
        },
        {
          type: 'separator'
        },
        {
          label: '重启应用',
          accelerator: 'Shift+CmdOrCtrl+R',
          click() {
            app.relaunch()
            app.exit(0)
          }
        },
        {
          type: 'separator'
        },
        {
          label: '退出',
          accelerator: 'CmdOrCtrl+Q',
          click () {
            app.quit()
          }
        }
      ]
    });
  }
  const appMenu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(appMenu)
}

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    minWidth: 930,
    minHeight: 600,
    titleBarStyle: 'hidden',
    webPreferences: {
      // 禁用安全策略
      webSecurity: false,
      enableRemoteModule: true,
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: !!process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })
  setMenu(win)
  remoteMain.enable(win.webContents)

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  checkUpdate(win)

}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
