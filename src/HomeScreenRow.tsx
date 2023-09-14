import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

// Icons
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";

interface I_state {
  dialog: boolean;
  password: string;
}
interface I_props {
  vault: I_VaultInformation;
  openVault: (vault: I_Vault) => void;
}

export default class HomeScreenRow extends React.Component<I_props, I_state> {
  state = {
    dialog: false,
    password: "",
  };
  openVault = () => {
    if (!this.props.vault.password)
      this.props.vault.password = this.state.password;
    window.CORDOVA?.openVault(this.props.vault, (newVault) => {
      if (!newVault) return;
      newVault.is_open = true;
      this.props.openVault(newVault);
    });
  };
  render = () => {
    return (
      <Box position={"relative"} sx={{ margin: "10px" }}>
        <Button
          fullWidth
          size="large"
          component="label"
          variant="contained"
          endIcon={
            this.props.vault.password ? (
              <LockOpenIcon fontSize="large" />
            ) : (
              <LockIcon fontSize="large" />
            )
          }
          onClick={() => {
            if (!this.props.vault.password) {
              this.setState({ dialog: true });
            } else this.openVault();
          }}
        >
          {this.props.vault.name}
        </Button>
        <Dialog
          open={this.state.dialog}
          onClose={() => {
            this.setState({ dialog: false });
          }}
        >
          <DialogTitle>Password</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This vault is locked behind a Password
            </DialogContentText>
            <TextField
              onChange={(e) => this.setState({ password: e.target.value })}
              type="password"
              label="Password"
              variant="standard"
              autoFocus
              fullWidth
              value={this.state.password}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.setState({ dialog: false });
              }}
            >
              Cancel
            </Button>
            <Button onClick={this.openVault}>Unlock</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };
}
