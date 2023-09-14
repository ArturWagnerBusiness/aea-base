import React from "react";
import {
  Backdrop,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Fab,
  Paper,
} from "@mui/material";

// Icons
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import DnsIcon from "@mui/icons-material/Dns";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import HomeScreenRow from "./HomeScreenRow";

interface I_state {
  addOrCreateVaultMenu: boolean;
}
interface I_props {
  vaults: I_VaultInformation[];
  changeScreen: I_ChangeScreen;
  openVault: (vault: I_Vault) => void;
}

export default class HomeScreen extends React.Component<I_props, I_state> {
  state = {
    addOrCreateVaultMenu: false,
  };
  openSettings = () => this.props.changeScreen("Settings");

  openVaults = () => {
    if (this.props.vaults.length === 0) {
      this.toggleAddOrCreateVaultMenu(true);
    } else {
      console.log("openVaults");
    }
  };
  openVault = () => this.props.changeScreen("VaultView");
  createVault = () => this.props.changeScreen("CreateVault");

  loadVault = () => console.log("loadVault");

  toggleAddOrCreateVaultMenu = (state: boolean) => {
    this.setState({
      addOrCreateVaultMenu: state,
    });
  };

  render = () => {
    return (
      <div className="HomeScreen">
        <div
          className="App"
          style={{
            justifyContent:
              this.props.vaults.length === 0 ? "center" : "flex-start",
          }}
        >
          {this.props.vaults.length === 0 ? (
            <>
              <p style={{ textAlign: "center" }}>You do not have any Vaults</p>
              <p style={{ textAlign: "center" }}>
                Press (+) to create your first one
              </p>
            </>
          ) : (
            this.props.vaults.map((vault) => {
              return (
                <HomeScreenRow vault={vault} openVault={this.props.openVault} />
              );
            })
          )}
        </div>
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
                  this.openVaults();
                  break;
                case 2:
                  this.openSettings();
                  break;
              }
            }}
          >
            <BottomNavigationAction
              label="Vaults"
              icon={<DnsIcon fontSize="large" />}
            />
            <Fab
              color="secondary"
              className="HomeVaultAddButton"
              onClick={() => {
                console.log("ee");
                this.toggleAddOrCreateVaultMenu(true);
              }}
            >
              <AddIcon fontSize="large" />
            </Fab>
            <BottomNavigationAction
              label="Settings"
              icon={<SettingsIcon fontSize="large" />}
            />
          </BottomNavigation>
        </Paper>
        <Backdrop
          className="ScreenCoverBlur"
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={this.state.addOrCreateVaultMenu}
          onClick={() => {
            this.toggleAddOrCreateVaultMenu(false);
          }}
        >
          <Box
            sx={{
              position: "absolute",
              bottom: "100px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Button
              variant="outlined"
              size="large"
              sx={{ backgroundColor: "white" }}
              startIcon={<VisibilityIcon fontSize="large" />}
              onClick={this.loadVault}
            >
              Load Vault
            </Button>
            <Button
              sx={{ marginTop: "5px", backgroundColor: "white" }}
              variant="outlined"
              size="large"
              startIcon={<NoteAddIcon fontSize="large" />}
              onClick={this.createVault}
            >
              Create Vault
            </Button>
          </Box>
        </Backdrop>
      </div>
    );
  };
}
