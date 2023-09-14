import {
  BottomNavigation,
  BottomNavigationAction,
  Breadcrumbs,
  Chip,
  Paper,
} from "@mui/material";
import React from "react";
import "./VaultView.css";
import SettingsIcon from "@mui/icons-material/Settings";
import DnsIcon from "@mui/icons-material/Dns";
import HomeIcon from "@mui/icons-material/Home";

interface I_props {
  changeScreen: I_ChangeScreen;
  openVault: I_Vault;
}
interface I_state {
  currentLocation: string[];
}
export default class VaultView extends React.Component<I_props, I_state> {
  state: I_state = {
    currentLocation: [],
  };
  componentDidMount(): void {
    console.log(this.props.openVault);
  }
  requestFolderCreation = (name: string) => {
    // Create folder
    // Add it to this.prop.openVault
  };
  requestFileCreation = (name: string) => {
    // Create file
    // Add it to this.prop.openVault
  };
  openFileEditor = (name: string) => {};
  render = () => {
    return (
      <div className="VaultView">
        <Breadcrumbs className="Breadcrumbs" separator={"/"}>
          <Chip
            icon={<HomeIcon />}
            label="Vault"
            onClick={() => {
              this.setState({ currentLocation: [] });
            }}
          />

          {this.state.currentLocation.map((location, index) => {
            return (
              <Chip
                label={location}
                onClick={() => {
                  this.setState({
                    currentLocation: this.state.currentLocation.filter(
                      (_, _index) => _index <= index
                    ),
                  });
                }}
              />
            );
          })}
        </Breadcrumbs>
        <hr />
        <Paper
          color="primary"
          sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
          elevation={3}
        >
          <BottomNavigation
            style={{ position: "relative" }}
            showLabels
            onChange={(event, pressedValue) => {
              switch (pressedValue) {
                case 0:
                  this.props.changeScreen("Homepage");
                  break;
                case 1:
                  this.props.changeScreen("Settings");
                  break;
              }
            }}
          >
            <BottomNavigationAction
              label="Vaults"
              icon={<DnsIcon fontSize="large" />}
            />
            <BottomNavigationAction
              label="Settings"
              icon={<SettingsIcon fontSize="large" />}
            />
          </BottomNavigation>
        </Paper>
      </div>
    );
  };
}
