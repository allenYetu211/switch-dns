import { app, BrowserWindow }  from 'electron';
import ComponentApp from './component/ipc';
import devConfig from './devConfig/index';


const createWindow  = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })
  if (process.env.NODE_ENV === 'development') {
    devConfig.devInit(win)
  }
}

app.whenReady().then(createWindow)

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
