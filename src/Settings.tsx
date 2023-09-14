import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import React from "react";

import SettingsIcon from "@mui/icons-material/Settings";
import DnsIcon from "@mui/icons-material/Dns";

interface I_props {
  changeScreen: I_ChangeScreen;
  openVault: I_Vault;
}

export default class Settings extends React.Component<I_props> {
  componentDidMount(): void {
    console.log(this.props.openVault);
  }
  render = () => {
    return (
      <div className="Settings">
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
              disabled
              icon={<SettingsIcon fontSize="large" />}
            />
          </BottomNavigation>
        </Paper>
      </div>
    );
  };
}
