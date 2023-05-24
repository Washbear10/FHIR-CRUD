import { Backdrop, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import * as React from "react";
import {
	createAuthHeaderValue,
	saveBasicAuthCreds,
} from "../../utilities/authentication/basicAuth";
import { LoginContext, SnackbarContext } from "../../utilities/other/Contexts";
import { testBasicAuth } from "../../utilities/querying/query";
import { useState } from "react";
import { CircularProgress } from "@mui/material";
/**
 * Component to display a login prompt
 */
export default function AuthenticationPrompt() {
	// consume context given by a high-hirarchy component
	const { authenticationPromptOpen, setAuthenticationPromptOpen } =
		React.useContext(LoginContext);

	// display states
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

	const [backDropOpen, setBackDropOpen] = useState(false);

	const handleClose = () => {
		setAuthenticationPromptOpen(false);
	};

	const handleSubmit = async () => {
		setBackDropOpen(true);

		// make HTTP Basic Auth header out of credentials supplied
		let b64Creds = createAuthHeaderValue(userNameInput, passwordInput);
		// test them with basic request
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
			alert("here unsucc");
			setError(true);
			setPasswordInput("");
			setSnackbarOpen(true);
			setSnackbarColor("error");
			setSnackbarMessage("Authentication unsuccessfull");
			setSnackbarTitle("Error");
		}
		setBackDropOpen(false);
		setTimeout(() => {
			setBackDropOpen(false);
		}, 10000);
	};

	return (
		<div>
			<Dialog
				open={authenticationPromptOpen}
				onClose={handleClose}
				onKeyUp={(e) => {
					if (e.key === "Enter") handleSubmit();
				}}
			>
				<Backdrop sx={{ color: "white", zIndex: 1 }} open={backDropOpen}>
					<CircularProgress color="inherit" />
				</Backdrop>
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
