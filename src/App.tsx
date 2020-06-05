import React, {useEffect,  useContext} from 'react';
import logo from './logo.svg';
import './App.css';

const xyRTC = require('./nodec/Release/xy-electron-sdk.node');


function App() {
  useEffect(() => {
    console.log('xyRTC:::', xyRTC);
    // const event = new xyRTC.EmitterThing();

		// event.on('test', (ev:any) => {
		// 	console.log('test ev: ', ev);
		// });

		// event.on('test2', (ev:any) => {
		// 	console.log('test ev2: ', ev);
		// });

		// event.on('test3', (ev:any) => {
		// 	console.log('test ev3: ', ev);
		// });

    // event.runReentrant(3);

    // console.log("event value : ", event.plusOne());
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
