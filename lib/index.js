'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var electron = require('electron');
var os = _interopDefault(require('os'));
var dns = _interopDefault(require('dns'));
var fs = _interopDefault(require('fs'));
var child_process = require('child_process');

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

// import os from 'os';
var ipcChangeDns = (function () {
    electron.ipcMain.on('getLocalDSN', function (event, arg) {
        console.log('arg', arg);
        dns.lookup(arg, function (err, address, family) {
            console.log('err:::', err);
            console.log('地址: %j 地址族: IPv%s', address, family);
            event.reply('reply-dns', address, family);
        });
        dns.resolve4(arg, function (err, address) {
            console.log('addresses：==>>>>', address);
            event.reply('reply-dns', address);
        });
    });
    electron.ipcMain.on('setServers', function (event, arg) {
        console.log('setLocalDns');
        dns.setServers([arg]);
    });
    electron.ipcMain.on('getServers', function (event, arg) {
        console.log('dns.getServers()', dns.getServers());
        event.reply('reply-getServer', dns.getServers());
    });
});

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var switchConfig = [
    'testdev.xylink.com',
    'testqa.xylink.com',
    'cloud.xylink.com',
    'zoom.xylink.com'
];
var switchMap = {
    txdev: 'testdev.xylink.com',
    txqa: 'testqa.xylink.com',
    pre: 'cloud.xylink.com',
    prd: 'cloud.xylink.com'
};

var dnsPromises = dns.promises;
var fsPromises = fs.promises;
var HOSTPATH = '/etc/hosts';
// const HOSTPATH = '/Users/Allen/Desktop/TEST.txt';
// pre dns 服务ip
var PREDNSSERVICEIP = '182.92.129.95';
// 公用dns 服务ip
var PUBLICDNSSERVICEIP = '8.8.8.8';
// 环境变量
// const EOL = WINDOWS
//   ? '\r\n'
//   : '\n'
// const HOSTPATH = WINDOWS
//   ? 'C:/Windows/System32/drivers/etc/hosts'
//   : '/etc/hosts'
var getHostFile = function (filePath) { return __awaiter(void 0, void 0, void 0, function () {
    var lines;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                lines = {};
                return [4 /*yield*/, fs.readFileSync(filePath, { encoding: 'utf8' }).split(/\r?\n/).forEach(function (line) {
                        var lineSansComments = line.replace(/#.*/, '');
                        var matches = /^\s*?(.+?)\s+(.+?)\s*$/.exec(lineSansComments);
                        if (matches && matches.length === 3) {
                            var ip = matches[1];
                            var host = matches[2];
                            lines[host] = ip;
                        }
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/, lines];
        }
    });
}); };
// 查询对应IP互联网DNS地址。
var getHostDnsIp = function (env) { return __awaiter(void 0, void 0, void 0, function () {
    var host, result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                host = switchMap[env];
                if (env === 'pre') {
                    dns.setServers([PREDNSSERVICEIP]);
                }
                else {
                    dns.setServers([PUBLICDNSSERVICEIP]);
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dnsPromises.resolve4(host)];
            case 2:
                result = _a.sent();
                return [2 /*return*/, result[0]];
            case 3:
                error_1 = _a.sent();
                return [2 /*return*/, Promise.reject({
                        code: 10000,
                        msg: error_1,
                        text: 'dns查询失败'
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); };
// 修改插入内容
var handleHostFile = function (hostLine, hostDnsIp) {
    if (hostDnsIp === void 0) { hostDnsIp = PUBLICDNSSERVICEIP; }
    // 查找是否有对应的IP
    switchConfig.forEach(function (item) {
        hostLine[item] = hostDnsIp;
    });
    return hostLine;
};
// 写入文件
var writeFile = function (lines) {
    return new Promise(function (resolve, reject) {
        fs.stat(HOSTPATH, function (error, stat) { return __awaiter(void 0, void 0, void 0, function () {
            var streamReslut, hostMap;
            return __generator(this, function (_a) {
                if (error) {
                    reject({
                        code: 10001,
                        msg: error,
                        text: 'fs.stat 文件不存在'
                    });
                    return [2 /*return*/];
                }
                streamReslut = fs.createWriteStream(HOSTPATH, { mode: stat.mode });
                streamReslut.on('close', resolve);
                streamReslut.on('error', resolve);
                hostMap = Object.keys(lines);
                if (hostMap.length !== 0) {
                    hostMap.forEach(function (item) {
                        streamReslut.write(lines[item] + " " + item + "\n");
                    });
                }
                else {
                    streamReslut.write("");
                }
                streamReslut.end();
                resolve();
                return [2 /*return*/];
            });
        }); });
    });
};
// 检测权限
var checkeAuthority = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, fsPromises.access(HOSTPATH, fs.constants.R_OK | fs.constants.W_OK)];
            case 1:
                _a.sent();
                return [2 /*return*/, Promise.resolve()];
            case 2:
                error_2 = _a.sent();
                return [2 /*return*/, Promise.reject({
                        code: 10002,
                        msg: error_2,
                        text: '文件权限检测'
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); };
// 写入文件处理
var handleWriteFile = function (result, resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
    var error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, writeFile(result)];
            case 1:
                _a.sent();
                resolve();
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                reject({
                    code: 10003,
                    msg: error_3,
                    text: 'writeFile 文件写入权限失败'
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
//  整体处理
var handleHostConfig = function (env) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var getFilesResult, resultHostDnsIp, result_1, e_1, cmd, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    return [4 /*yield*/, getHostFile(HOSTPATH)];
                case 1:
                    getFilesResult = _a.sent();
                    return [4 /*yield*/, getHostDnsIp(env)];
                case 2:
                    resultHostDnsIp = _a.sent();
                    result_1 = handleHostFile(getFilesResult, resultHostDnsIp);
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 6, , 7]);
                    return [4 /*yield*/, checkeAuthority()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, handleWriteFile(result_1, resolve, reject)];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    e_1 = _a.sent();
                    cmd = [
                        "echo 211 | sudo -S chmod 777 " + HOSTPATH
                        // , `echo 211 | sudo -S chmod 644 ${HOSTPATH}`
                        // , 'rm -rf ' + tmp_fn
                    ].join(' && ');
                    child_process.exec(cmd, function (error, stout, stderr) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!error) return [3 /*break*/, 1];
                                    reject({
                                        code: 10004,
                                        msg: error,
                                        text: 'exec 执行失败'
                                    });
                                    return [3 /*break*/, 3];
                                case 1: return [4 /*yield*/, handleWriteFile(result_1, resolve, reject)];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [3 /*break*/, 7];
                case 7: return [3 /*break*/, 9];
                case 8:
                    e_2 = _a.sent();
                    reject(e_2);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    }); });
};
var ipcSwitchLocalDns = (function () {
    electron.ipcMain.on('set-local-dns', function (event, env) { return __awaiter(void 0, void 0, void 0, function () {
        var e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, handleHostConfig(env)];
                case 1:
                    _a.sent();
                    event.reply('reply-local-dns', 'succeed');
                    return [3 /*break*/, 3];
                case 2:
                    e_3 = _a.sent();
                    event.reply('reply-local-dns', e_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    electron.ipcMain.on('set-empty-host', function (event, env) { return __awaiter(void 0, void 0, void 0, function () {
        var e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, writeFile({})];
                case 1:
                    _a.sent();
                    event.reply('reply-empty-host', 'succeed');
                    return [3 /*break*/, 3];
                case 2:
                    e_4 = _a.sent();
                    event.reply('reply-empty-host', e_4);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
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
    ipcChangeDns();
    ipcSwitchLocalDns();
});
electron.app.on('activate', function () {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (electron.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
