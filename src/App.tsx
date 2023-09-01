import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';

const theme = createTheme({
  palette: {
    mode: "light", // "dark"
  },
});

export default class App extends React.Component{
  render() {
    return (
      <ThemeProvider theme={theme}>
        <div className="App">
          <p>This should be visible on the App</p>
        </div>
      </ThemeProvider>
    );
  }
}
