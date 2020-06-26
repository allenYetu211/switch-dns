import dns from 'dns';
import {ipcMain}  from 'electron';

// import os from 'os';

export default ()  => {
  ipcMain.on('getLocalDSN', (event:any, arg:string) => {
    console.log('arg',  arg)
    dns.lookup(arg, (err, address, family) => {
      console.log('err:::', err)
      console.log('地址: %j 地址族: IPv%s', address, family);
      event.reply('reply-dns', address, family);
    });

    dns.resolve4(arg, (err, address) => {
      console.log('addresses：==>>>>', address,);
      event.reply('reply-dns', address);
    });
  })

  ipcMain.on('setServers', (event:any, arg:string) => {
    console.log('setLocalDns')
    dns.setServers([arg])
  })

  ipcMain.on('getServers', (event:any, arg:string) => {
    console.log('dns.getServers()', dns.getServers())
    event.reply('reply-getServer',dns.getServers() )
  })
  
}