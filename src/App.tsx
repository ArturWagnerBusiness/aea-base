import { ThemeProvider, createTheme } from "@mui/material/styles";
import React from "react";
import CreateVault from "./CreateVault";
import HomeScreen from "./HomeScreen";

import "./HomeScreen.css";

const theme = createTheme({
  palette: {
    mode: "light", // "dark"
  },
});

interface I_state {
  vaults: I_Vault[];
  currentScreen: I_ScreenTypeOption;
}

export default class App extends React.Component<{}, I_state> {
  state: I_state = {
    vaults: [],
    currentScreen: "Homepage",
  };
  render = () => {
    return (
      <ThemeProvider theme={theme}>
        {this.state.currentScreen === "Homepage" ? (
          <HomeScreen
            vaults={this.state.vaults}
            changeScreen={(name) => {
              this.setState({ currentScreen: name });
            }}
          />
        ) : (
          ""
        )}
        {this.state.currentScreen === "CreateVault" ? (
          <CreateVault
            changeScreen={(name) => {
              this.setState({ currentScreen: name });
            }}
            addVault={(vault) => {
              this.setState({ vaults: [...this.state.vaults, vault] });
            }}
          />
        ) : (
          ""
        )}
      </ThemeProvider>
    );
  };
}
