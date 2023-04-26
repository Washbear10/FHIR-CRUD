import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { LoginContext, SnackbarContext } from "../utilities/Contexts";
import {
	createAuthHeaderValue,
	saveBasicAuthCreds,
} from "../utilities/basicAuth";
import { testBasicAuth } from "../utilities/query";
import { Typography } from "@mui/material";

export default function AuthenticationPrompt() {
	const { authenticationPromptOpen, setAuthenticationPromptOpen } =
		React.useContext(LoginContext);
	const [userNameInput, setUserNameInput] = React.useState("");
	const [passwordInput, setPasswordInput] = React.useState("");
	const [error, setError] = React.useState(false);
	const {
		snackbarOpen,
		setSnackbarOpen,
		snackbarColor,
		setSnackbarColor,
		snackbarMessage,
		setSnackbarMessage,
		snackbarTitle,
		setSnackbarTitle,
	} = React.useContext(SnackbarContext);

	const handleClose = () => {
		setAuthenticationPromptOpen(false);
	};

	const handleSubmit = async () => {
		let b64Creds = createAuthHeaderValue(userNameInput, passwordInput);
		let testResult = await testBasicAuth(b64Creds);
		console.log(testResult);
		if (testResult == "Ok") {
			setError(false);
			saveBasicAuthCreds(b64Creds);
			setPasswordInput("");
			setUserNameInput("");
			setAuthenticationPromptOpen(false);
			setSnackbarOpen(true);
			setSnackbarColor("success");
			setSnackbarMessage("Authenticated.");
			setSnackbarTitle("Success");
		} else {
			setError(true);
			setPasswordInput("");
			setSnackbarOpen(true);
			setSnackbarColor("error");
			setSnackbarMessage("Authentication unsuccessfull");
			setSnackbarTitle("Error");
		}
	};

	return (
		<div>
			<Dialog open={authenticationPromptOpen} onClose={handleClose}>
				<DialogTitle>Authenticate</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Supply authentication credentials
					</DialogContentText>
					<TextField
						value={userNameInput}
						onChange={(e) => {
							setUserNameInput(e.target.value);
						}}
						autoFocus
						margin="dense"
						id="username"
						label="Username"
						fullWidth
						variant="standard"
						error={error}
					/>
					<TextField
						value={passwordInput}
						onChange={(e) => {
							setPasswordInput(e.target.value);
						}}
						margin="dense"
						id="password"
						label="Password"
						fullWidth
						variant="standard"
						type="password"
						error={error}
					/>
					{error ? (
						<Typography color="error">Invalid credentials</Typography>
					) : null}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={handleSubmit}>Authenticate</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
