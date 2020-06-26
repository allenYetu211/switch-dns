import React, {useEffect} from 'react';

import {ipcRenderer} from 'electron';

import { Select } from 'antd';

import {switchConfig, switchMap} from './swtichConfig';

const { Option } = Select;

const IndexView = () => {
  useEffect( () => {
    ipcRenderer.send('localIp');
    addListen()
  }, []);

  const addListen  = () => {
    ipcRenderer.on('getLogalIp', (event: any, data: any) => {
      console.log('getLogalIp:', data)
    })

    ipcRenderer.on('reply-dns', (event: any, data: any) => {
      console.log('reply-dns', data)
    })

    ipcRenderer.on('reply-getServer', (event: any, data: any) => {
      console.log('reply-getServer', data)
    })
    
    ipcRenderer.on('reply-empty-host', (event: any, data: any) => {
      console.log('reply-empty-host', data)
    })

    ipcRenderer.on('reply-local-dns', (event: any, data: any, ...args) => {
      if (data === 'succeed') {
        console.log('修改成功')
      } else {
        console.log('error', data)
      }
    })
    
  }

  const handleChange = (value: string) => {
    ipcRenderer.send('set-local-dns', value)
  }

  return (
    <div>

      <Select 
      defaultValue='txdev'  
      style={{ width: 200 }}
      onChange={handleChange}>
        {switchMap.map((item:string, index: number) => {
            return (<Option value={item} key={index}>{item}</Option>)
          })}
      </Select>

      <button onClick={() => {
         ipcRenderer.send('set-empty-host')
      }}>
        set-empty-host
      </button>

      {/* <button onClick={() => {
         ipcRenderer.send('getServers')
      }}>
        getServers， 获取DNS服务器地址
      </button>

      <button onClick={() => {
         ipcRenderer.send('setServers', '182.92.129.95')
      }}>
        setServers， 设置DNS服务器地址 代理环境
      </button>
      
      <button onClick={() => {
         ipcRenderer.send('setServers', '8.8.8.8')
      }}>
        setServers， 设置DNS服务器地址 非代理环境
      </button>

      
      
      <button onClick={() => {
         ipcRenderer.send('getLocalDSN', 'cloud.xylink.com')
      }}>
        getLocalDSN
      </button>
       */}
     

    </div>

  )
}

export default IndexView;