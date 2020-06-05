
console.log('process.env.NODE_ENV', process.env.NODE_ENV)



const devConfig = {
  devInit(win:any){
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/../node_modules/electron`)
    });

    win.webContents.openDevTools();
    win.loadURL('http://localhost:3000');
    // console.log('`${__dirname}/../demo/index.html`', `${__dirname}/../demo/index.html`)
    // win.loadFile(`${__dirname}/../demo/index.html`);
  },
}


export default devConfig;
