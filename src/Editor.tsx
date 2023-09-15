import { AppBar, Button, Dialog, TextField, Toolbar } from "@mui/material";
import React from "react";

import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

interface I_props {
  onClose: () => void;
  onSave: (data: string) => void;
  onDataRequest: (callback: (data: string) => void) => void;
  display: string;
}
interface I_state {
  content: string;
  isLoading: boolean;
}
export default class Editor extends React.Component<I_props, I_state> {
  state = {
    content: "",
    isLoading: true,
  };
  componentDidMount = () => {
    this.props.onDataRequest((data) => {
      this.setState({
        content: data,
        isLoading: false,
      });
    });
  };
  render = () => {
    return (
      <Dialog fullScreen open={true} onClose={this.props.onClose}>
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <Button
              color="inherit"
              startIcon={<CloseIcon />}
              onClick={this.props.onClose}
            >
              Close
            </Button>
            <Button
              color="inherit"
              sx={{ position: "absolute", right: "16px" }}
              endIcon={<SaveIcon />}
              onClick={() => {
                this.props.onSave(this.state.content);
              }}
            >
              Save
            </Button>
          </Toolbar>
        </AppBar>
        <h3 style={{ marginBottom: "0px" }}>
          {this.props.display + (this.state.isLoading ? " (Loading)" : "")}
        </h3>
        <TextField
          style={{ margin: "5px" }}
          disabled={this.state.isLoading}
          multiline
          value={this.state.content}
          onChange={(e) => {
            this.setState({ content: e.target.value });
          }}
          variant="standard"
        />
      </Dialog>
    );
  };
}
