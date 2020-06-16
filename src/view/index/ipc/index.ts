import {ipcRenderer} from 'electron';

export const ipcGetIp  = (callback: (data: any) => void) => {

  ipcRenderer.send('localIp', (event: any, data: any) => {
    console.log('localIp')
  })
  ipcRenderer.on('getLogalIp', (event: any, data: any) => {
    callback(data)
  })
};

