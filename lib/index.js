'use strict';

var electron = require('electron');

console.log('process.env.NODE_ENV', process.env.NODE_ENV);
var devConfig = {
    devInit: function (win) {
        require('electron-reload')(__dirname, {
            electron: require(__dirname + "/../node_modules/electron")
        });
        win.webContents.openDevTools();
        win.loadURL('http://localhost:3000');
        // console.log('`${__dirname}/../demo/index.html`', `${__dirname}/../demo/index.html`)
        // win.loadFile(`${__dirname}/../demo/index.html`);
    },
};

var createWindow = function () {
    var win = new electron.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    if (process.env.NODE_ENV === 'development') {
        devConfig.devInit(win);
    }
};
electron.app.whenReady().then(createWindow);
electron.app.on('activate', function () {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (electron.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
