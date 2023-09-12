import { Button, Paper } from "@mui/material";
import React from "react";
import { logHistory } from "..";

export default class Debug extends React.Component {
  refresher?: NodeJS.Timer;
  visible = false;
  componentDidMount = () => {
    // clear as componentDidMount() calls twice
    clearInterval(this.refresher);
    this.refresher = setInterval(() => {
      if (this.visible) this.forceUpdate();
    }, 500);
  };
  render = () => {
    return (
      <>
        <Button
          style={{ zIndex: 99, position: "fixed", top: 0, left: 0 }}
          onClick={() => {
            // Toggle visibility of the debug menu.
            this.visible = !this.visible;
            this.forceUpdate();
          }}
        >
          DEBUG
        </Button>
        {this.visible ? (
          // List of all logged information
          <Paper
            style={{
              zIndex: 98,
              position: "fixed",
              width: "100%",
              bottom: 0,
              backgroundColor: "rgba(255,255,255,0.75)", // To see app respond in the back.
            }}
          >
            {logHistory}
          </Paper>
        ) : undefined}
      </>
    );
  };
}
