import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  TextField,
} from "@mui/material";
import React from "react";
import "./VaultView.css";

import SettingsIcon from "@mui/icons-material/Settings";
import DnsIcon from "@mui/icons-material/Dns";
import HomeIcon from "@mui/icons-material/Home";
import DescriptionIcon from "@mui/icons-material/Description";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FolderIcon from "@mui/icons-material/Folder";

interface I_props {
  changeScreen: I_ChangeScreen;
  openVault: I_Vault;
}
interface I_state {
  currentLocation: string[];
  speedDial: boolean;
  event: "folder" | "file" | "upload" | null;
  text: string;
  error: string;
}
export default class VaultView extends React.Component<I_props, I_state> {
  state: I_state = {
    currentLocation: [],
    speedDial: false,
    event: null,
    text: "",
    error: "",
  };
  componentDidMount(): void {
    console.log(this.props.openVault);
  }
  openFileEditor = (name: string) => {};

  render = () => {
    return (
      <div className="VaultView">
        <Breadcrumbs className="Breadcrumbs" separator={"/"}>
          <Chip
            icon={<HomeIcon />}
            label={this.props.openVault.info.name}
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
        <Box className="FileDisplay">
          {window.CORDOVA.getVaultFolder(this.props.openVault.content, [
            ...this.state.currentLocation,
          ]).content.map((item) => {
            return (
              <Paper
                onClick={() => {
                  if (item.is_dir) {
                    this.setState({
                      currentLocation: [
                        ...this.state.currentLocation,
                        item.encoded_name,
                      ],
                    });
                  } else {
                    console.log("CODE TO READING/OPEN FILE");
                  }
                }}
              >
                <div style={{ textAlign: "center" }}>
                  {item.is_dir ? (
                    <FolderIcon style={{ width: "80%", height: "auto" }} />
                  ) : (
                    <DescriptionIcon style={{ width: "80%", height: "auto" }} />
                  )}
                </div>
                <p>
                  {item.encoded_name} ({item.name})
                </p>
              </Paper>
            );
          })}
        </Box>

        <Box
          sx={{
            position: "fixed",
            bottom: "70px",
            right: "0px",
          }}
        >
          <SpeedDial
            ariaLabel="PerformAction"
            sx={{ position: "absolute", bottom: 0, right: 16 }}
            icon={<SpeedDialIcon />}
            onClose={() => this.setState({ speedDial: false })}
            onOpen={() => this.setState({ speedDial: true })}
            open={this.state.speedDial}
          >
            {[
              {
                name: "Create Folder",
                icon: <CreateNewFolderIcon />,
                event: () => {
                  this.setState({ event: "folder" });
                },
              },
              {
                name: "Create File",
                icon: <NoteAddIcon />,
                event: () => {
                  this.setState({ event: "file" });
                },
              },
              {
                name: "Add File",
                icon: <FileUploadIcon />,
                event: () => {},
              },
            ].map((action) => (
              <SpeedDialAction
                icon={action.icon}
                tooltipTitle={action.name}
                tooltipOpen
                onClick={action.event}
              />
            ))}
          </SpeedDial>
        </Box>
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
        <Dialog
          open={this.state.event !== null}
          onClose={() => {
            this.setState({ event: null });
          }}
        >
          <DialogTitle>Input {this.state.event} name</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please pick a name for your new {this.state.event}.
            </DialogContentText>
            <TextField
              onChange={(e) => this.setState({ text: e.target.value })}
              type="text"
              label="Name"
              variant="standard"
              autoFocus
              error={this.state.error !== ""}
              fullWidth
              value={this.state.text}
              helperText={this.state.error}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.setState({ event: null });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                let foundDupes = window.CORDOVA.getVaultFolder(
                  this.props.openVault.content,
                  [...this.state.currentLocation]
                ).content.filter(
                  (item) => item.encoded_name === this.state.text
                ).length;
                if (foundDupes > 0) {
                  this.setState({ error: "Name exists" });
                  return;
                }
                switch (this.state.event) {
                  case "file":
                    window.CORDOVA.vaultCreateEntry(
                      [...this.state.currentLocation],
                      this.state.text,
                      "file",
                      this.props.openVault,
                      (status) => {
                        if (!status) console.log("FAILED CREATING FILE");
                        this.setState(
                          { event: null, text: "" },
                          () => this.forceUpdate
                        );
                      }
                    );
                    break;
                  case "folder":
                    window.CORDOVA.vaultCreateEntry(
                      [...this.state.currentLocation],
                      this.state.text,
                      "folder",
                      this.props.openVault,
                      (status) => {
                        if (!status) console.log("FAILED CREATING FOLDER");
                        this.setState(
                          { event: null, text: "" },
                          () => this.forceUpdate
                        );
                      }
                    );
                    break;
                  default:
                    this.setState(
                      { event: null, text: "" },
                      () => this.forceUpdate
                    );
                    break;
                }
              }}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };
}
