import { Button } from "@mui/base";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import React from "react";
import CreateVault from "./CreateVault";
import HomeScreen from "./HomeScreen";

import "./HomeScreen.css";
import Settings from "./Settings";
import VaultView from "./VaultView";

const theme = createTheme({
  palette: {
    mode: "light", // "dark"
  },
});

interface I_state {
  vaults: I_VaultInformation[];
  currentScreen: I_ScreenTypeOption;
  openVault: I_Vault | undefined;
}

export default class App extends React.Component<{}, I_state> {
  state: I_state = {
    vaults: [],
    currentScreen: "Homepage",
    openVault: undefined,
  };
  componentDidMount = () => {
    window.CORDOVA?.loadVaults((vaults) => {
      this.setState({
        vaults: vaults,
      });
    });
  };
  render = () => {
    return (
      <ThemeProvider theme={theme}>
        {this.state.currentScreen === "Homepage" ? (
          <HomeScreen
            vaults={this.state.vaults}
            openVault={(vault) => {
              this.setState({ openVault: vault, currentScreen: "VaultView" });
            }}
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
            addVault={(vault, callback) => {
              window.CORDOVA?.saveVaults(
                [...this.state.vaults, vault.info],
                (worked) => {
                  if (worked) {
                    this.setState({
                      vaults: [...this.state.vaults, vault.info],
                    });
                    callback(true);
                  } else {
                    callback(false);
                  }
                }
              );
            }}
          />
        ) : (
          ""
        )}

        {this.state.currentScreen === "VaultView" ? (
          <VaultView
            changeScreen={(name) => {
              this.setState({ currentScreen: name });
            }}
            openVault={this.state.openVault as I_Vault}
          />
        ) : (
          ""
        )}

        {this.state.currentScreen === "Settings" ? (
          <Settings
            changeScreen={(name) => {
              this.setState({ currentScreen: name });
            }}
            openVault={this.state.openVault as I_Vault}
          />
        ) : (
          ""
        )}
      </ThemeProvider>
    );
  };
}
