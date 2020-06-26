import {ipcRenderer} from 'electron';




export const ipcGetIp  = (callback: (data: any) => void) => {
  ipcRenderer.send('localIp')
};

export const ipcDns =(callback: (data: any) => void) => {
  ipcRenderer.send('loaclDns','cloud.xylink.com')
}

export const ipcSetDns = () :void => {
  ipcRenderer.send('setLocalDns')
}

