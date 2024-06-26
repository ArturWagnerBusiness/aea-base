import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
} from "@mui/material";
import React from "react";
import "./CreateVault.css";
interface I_props {
  changeScreen: I_ChangeScreen;
  addVault: (vault: I_Vault, callback: (isAdded: boolean) => void) => void;
}
interface I_state {
  stage: number;
  name: string;
  nameWrong: string;
  path: string;
  pathWrong: string;
  password: string;
  password2: string;
  passwordWrong: string;
  isCreatingVaultCompleted: boolean;
  createdVault: I_Vault | undefined;
  creatingVaultMessage: string;
}
export default class CreateVault extends React.Component<I_props, I_state> {
  state: I_state = {
    stage: 0,
    name: "",
    nameWrong: "",
    path: "",
    pathWrong: "",
    password: "",
    password2: "",
    passwordWrong: "",
    isCreatingVaultCompleted: false,
    createdVault: undefined,
    creatingVaultMessage: "Creating vault...",
  };
  steps = ["Name", "Location", "Password", "Creating"];
  stepBack = () => {
    this.setState({ stage: this.state.stage - 1 });
  };
  stepNext = () => {
    if (this.state.stage === 0) {
      if (this.state.name === "") {
        this.setState({ nameWrong: "Name is too short" });
      } else {
        this.setState({ stage: this.state.stage + 1 });
      }
    } else if (this.state.stage === 1) {
      this.setState({ stage: this.state.stage + 1 });
    } else if (this.state.stage === 2) {
      if (this.state.password.length !== this.state.password2.length) {
        this.setState({ passwordWrong: "Passwords do not match!" });
      } else if (this.state.password.length < 3) {
        this.setState({ passwordWrong: "Passwords too short!" });
      } else {
        this.setState({
          stage: this.state.stage + 1,
          isCreatingVaultCompleted: true,
        });
        this.createNewVault();
      }
    } else if (this.state.stage === 3) this.props.changeScreen("Homepage");
  };
  cancel = () => this.props.changeScreen("Homepage");

  createNewVault = () => {
    window.CORDOVA?.createVault(
      {
        name: this.state.name,
        path: "",
        password: this.state.password,
        algorithm: "AES",
      },
      (vault) => {
        if (vault === null) {
          this.setState({
            isCreatingVaultCompleted: false,
            creatingVaultMessage: "Vault could not be created",
          });
        } else {
          this.setState({
            creatingVaultMessage: "Adding vault to homepage...",
            createdVault: vault,
          });
          this.props.addVault(vault, (isSuccess) => {
            this.setState({
              isCreatingVaultCompleted: true,
              creatingVaultMessage: isSuccess ? "" : "Was unable to add vault!",
            });
          });
        }
      }
    );
  };
  render = () => {
    return (
      <div className="CreateVault">
        <div className="Top">
          <Button className="AdvanceModeButton" variant="outlined">
            Advance Mode
          </Button>
          <br />
          <Stepper
            className="Stepper"
            activeStep={this.state.stage}
            alternativeLabel
          >
            {this.steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>
        <div className="Mid">
          {this.state.stage === 0 ? (
            <div className="Item">
              <p>Please pick the name you want for your vault</p>
              <TextField
                required
                fullWidth
                label="Name"
                error={this.state.nameWrong !== ""}
                defaultValue=""
                helperText={this.state.nameWrong}
                value={this.state.name}
                onChange={(e) => {
                  this.setState({ name: e.target.value, nameWrong: "" });
                }}
              />
            </div>
          ) : (
            ""
          )}

          {this.state.stage === 1 ? (
            <div className="Item">
              <p>Please pick the path for your vault (IGNORE)</p>
            </div>
          ) : (
            ""
          )}

          {this.state.stage === 2 ? (
            <>
              <div className="Item">
                <p>Please pick a password for your vault</p>
                <TextField
                  required
                  fullWidth
                  error={this.state.passwordWrong !== ""}
                  type="password"
                  label="Password"
                  defaultValue=""
                  value={this.state.password}
                  onChange={(e) => {
                    if (
                      this.state.passwordWrong === "Passwords do not match!" &&
                      this.state.password2 === e.target.value
                    ) {
                      this.setState({
                        password: e.target.value,
                        passwordWrong: "",
                      });
                    } else if (
                      this.state.passwordWrong === "Passwords too short!"
                    ) {
                      this.setState({
                        password: e.target.value,
                        passwordWrong: "",
                      });
                    } else {
                      this.setState({ password: e.target.value });
                    }
                  }}
                />
              </div>
              <div className="Item">
                <TextField
                  required
                  fullWidth
                  error={this.state.passwordWrong !== ""}
                  id="outlined-required"
                  type="password"
                  label="Repeat password"
                  defaultValue=""
                  helperText={this.state.passwordWrong}
                  value={this.state.password2}
                  onChange={(e) => {
                    if (
                      this.state.passwordWrong === "Passwords do not match!" &&
                      this.state.password === e.target.value
                    ) {
                      this.setState({
                        password2: e.target.value,
                        passwordWrong: "",
                      });
                    } else if (
                      this.state.passwordWrong === "Passwords too short!"
                    ) {
                      this.setState({
                        password2: e.target.value,
                        passwordWrong: "",
                      });
                    } else {
                      this.setState({ password2: e.target.value });
                    }
                  }}
                />
              </div>
            </>
          ) : (
            ""
          )}

          {this.state.stage === 3 ? (
            <>
              {this.state.isCreatingVaultCompleted ? (
                <>
                  <p>[Done]</p>
                </>
              ) : (
                <>
                  <CircularProgress color="secondary" />
                  <p>{this.state.creatingVaultMessage}</p>
                </>
              )}
            </>
          ) : (
            ""
          )}
        </div>
        <div className="Bot">
          {this.state.stage === 0 ? (
            <Button
              fullWidth
              size="large"
              variant="contained"
              onClick={this.cancel}
            >
              Cancel
            </Button>
          ) : (
            <Button
              fullWidth
              disabled={this.state.stage === this.steps.length - 1}
              size="large"
              variant="contained"
              onClick={this.stepBack}
            >
              Back
            </Button>
          )}
          <Box width={30}> </Box>

          <Button
            fullWidth
            size="large"
            disabled={
              this.state.stage === this.steps.length - 1
                ? !this.state.isCreatingVaultCompleted
                : false
            }
            variant="contained"
            onClick={this.stepNext}
          >
            {this.state.stage === this.steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>
      </div>
    );
  };
}
