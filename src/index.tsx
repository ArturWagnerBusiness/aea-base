import React from "react";
import { createRoot } from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";

import App from "./App";
import Debug from "./components/Debug";

// Roboto, Google's font used as default Material-UI font
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

// TODO: Disable before project conclusion, OR remove the <Debug /> element from the DOM
// Can be enabled to see the console.log output on mobile
const IS_DEBUG = false;

export let logHistory: JSX.Element[] = [];

if (IS_DEBUG) {
  const oldLogger = console.log; // Save pointer
  let newLogger = (...data: any) => {
    // Print using console
    oldLogger(...data);
    // Pass into div display element
    logHistory.push(
      ...data.map((x: any) => {
        return <p>{x}</p>;
      })
    );
  };
  console.log = newLogger;
  console.warn = newLogger;
}

// Instead of the old way as to not limit React to behave as version 17
const root = createRoot(document.getElementById("root") as HTMLElement);
const initiateReactApp = () => {
  root.render(
    <React.StrictMode>
      <CssBaseline />
      {IS_DEBUG ? <Debug /> : ""}
      <App />
    </React.StrictMode>
  );
};
// Ensure Real Cordova has fully loaded
//@ts-ignore
if (window.cordova) {
  document.addEventListener("deviceready", initiateReactApp, false);
} else {
  initiateReactApp();
}
