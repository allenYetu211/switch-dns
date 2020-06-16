import React, {useEffect} from 'react';
import {ipcGetIp} from './ipc/index';

const IndexView = () => {

  useEffect( () => {
    ipcGetIp((data: any) => {
      console.log('react, data::', data)
    })
  }, [])

  return (
    <div>
      IndexView
    </div>
  )
}

export default IndexView;