const { dialog, ipcMain } = require('electron')
const { autoUpdater } = require('electron-updater')
//默认会自动下载新版本，如果不想自动下载，设置autoUpdater.autoDownload = false
// 不自动下载
autoUpdater.autoDownload = false
// 手动触发下载
// autoUpdater.downloadUpdate()
ipcMain.on('update', (event, arg) => {
  autoUpdater.checkForUpdates()
})
export default function checkUpdate (mainWindow) {
  //检测更新
  autoUpdater.checkForUpdates()

  //监听'error'事件
  autoUpdater.on('error', err => {
    dialog.showMessageBox({
      type: 'info',
      title: '检查更新',
      message: '检查更新失败',
      buttons: ['关闭']
    })
  })

  // 检查更新中
  autoUpdater.on('checking-for-update', () => {
    mainWindow.webContents.send('checkingUpdate')
  })

  // 检测到有新版本更新
  autoUpdater.on('update-available', info => {
    dialog.showMessageBox({
      type: 'info',
      title: '应用更新',
      message: `发现新版本 ${info.version}，是否下载？`,
      buttons: ['下载', '以后再说']
    })
    .then(buttonIndex => {
      if (buttonIndex.response == 0) {
        // 如果选择下载则手动触发
        autoUpdater.downloadUpdate()
      }
    })
    mainWindow.webContents.send('updateAvailable', info)
  })

  // 暂无新版本可更新
  autoUpdater.on('update-not-available', info => {
    mainWindow.webContents.send('updateNotAvailable', info)
  })

  // 更新下载进度事件
  autoUpdater.on('download-progress', progressObj => {
    mainWindow.webContents.send('updateDownloading', progressObj)
  })

  //监听'update-downloaded'事件，新版本下载完成时触发
  autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('updateDownloading', 'updateDownloaded')
    dialog.showMessageBox({
        type: 'info',
        title: '应用更新',
        message: '下载完成，是否立即更新？',
        buttons: ['立即更新', '以后再说']
      })
      .then(buttonIndex => {
        if (buttonIndex.response == 0) {
          //选择是，则退出程序，安装新版本
          autoUpdater.quitAndInstall(true, true)
        }
      })
  })
}
