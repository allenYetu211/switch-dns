'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var electron = require('electron');
var os = _interopDefault(require('os'));
var dns = _interopDefault(require('dns'));

var ipcGetLocalIp = (function () {
    electron.ipcMain.on('localIp', function (event, arg) {
        var interfaces = os.networkInterfaces();
        Object.keys(interfaces).some(function (item) {
            return interfaces[item].some(function (alias) {
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    event.reply('getLogalIp', alias.address);
                    return true;
                }
            });
        });
    });
    dns.lookup('example.org', function (err, address, family) {
        console.log('地址: %j 地址族: IPv%s', address, family);
    });
});

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

// import fs from 'fs';
// const { ipcMain } = require('electron')
// ipcMain.on('asynchronous-message', (event, arg) => {
//   console.log('fs','__dirname::', `${__dirname}/../public/robots.txt`)
//   fs.readFile(`${__dirname}/../public/robots.txt`, function (err, data) {
//     if (err) {
//         return console.error(err);
//     }
//     event.reply('asynchronous-reply', data.toString())
//  });
// })
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
electron.app.whenReady()
    .then(createWindow)
    .then(function () {
    ipcGetLocalIp();
});
electron.app.on('activate', function () {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (electron.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
