import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import CssBaseline from '@mui/material/CssBaseline';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const initiateReactApp = () => {
ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <App />
  </React.StrictMode>,
  document.getElementById('root') as HTMLElement
);
}

//@ts-ignore
if(window.cordova) {
  document.addEventListener(
    'deviceready',
    initiateReactApp,
    false
  );
} else {
  initiateReactApp();
}