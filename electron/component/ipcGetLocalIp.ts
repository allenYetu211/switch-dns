import {ipcMain}  from 'electron';
import os from 'os';
import dns from 'dns';


export default ()  => {


  ipcMain.on('localIp', (event, arg) => {
    const interfaces = os.networkInterfaces();
    Object.keys(interfaces).some((item) => {
      return interfaces[item].some((alias:any)  => {
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          event.reply('getLogalIp', alias.address);
          return true
        }
      })
    })
  });

  dns.lookup('example.org', (err, address, family) => {
    console.log('地址: %j 地址族: IPv%s', address, family);
 });


}
