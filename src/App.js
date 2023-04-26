import CustomAppBar from "./components/CustomAppBar";
import Home from "./pages/Home/Home";
import "./App.css";
import { useState, useEffect } from "react";

import { createTheme } from "@mui/material/styles";
import * as colors from "@mui/material/colors";
import { ThemeProvider } from "@emotion/react";
import { createContext } from "react";
import React from "react";
import { LoginContext, SnackbarContext } from "./utilities/Contexts";
import AuthenticationPrompt from "./components/AuthenticationPrompt";
import dayjs from "dayjs";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link,
	BrowserRouter,
} from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import { AlertTitle } from "@mui/material";
const theme = createTheme({
	components: {
		MuiDataGrid: {
			styleOverrides: {
				row: {
					"&:hover": {
						cursor: "pointer",
					},
				},
			},
		},
		MuiAutocomplete: {
			defaultProps: {
				size: "small",
				variant: "contained",
			},
		},
		ButtonBase: {
			defaultProps: {
				// The default props to change
				disabled: true, // No more ripple, on the whole application 💣!
			},
			styleOverrides: {
				row: {
					"&:hover": {
						cursor: "pointer",
					},
				},
			},
		},
		MuiButton: {
			defaultProps: {
				// The default props to change
				disabled: true, // No more ripple, on the whole application 💣!
			},
			styleOverrides: {
				root: {
					textTransform: "none",
				},
			},
		},
	},
	palette: {
		primary: {
			main: colors.indigo[900],
		},
		secondary: {
			main: "#f44336",
		},
		success: {
			main: colors.green[500],
		},
		greyedOutInput: {
			main: "rgba(0, 0, 0, 0.88)",
		},
		error: {
			main: colors.red[800],
		},
		warning: {
			main: colors.orange[800],
		},
	},
	typography: {
		subtitle1: {
			fontSize: 14,
			fontWeight: 600,
		},
		subtitle2: {
			fontSize: 12,
		},
		body1: {
			fontWeight: 500,
		},
		button: {
			fontStyle: "italic",
		},
	},
});

dayjs.locale("de");
window.DEFAULTDATETABSWIDTH = "300px";

function App() {
	const [authenticationPromptOpen, setAuthenticationPromptOpen] =
		useState(false);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarColor, setSnackbarColor] = useState("");
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarTitle, setSnackbarTitle] = useState("");
	return (
		<ThemeProvider theme={theme}>
			<SnackbarContext.Provider
				value={{
					snackbarOpen,
					setSnackbarOpen,
					snackbarColor,
					setSnackbarColor,
					snackbarMessage,
					setSnackbarMessage,
					snackbarTitle,
					setSnackbarTitle,
				}}
			>
				<LoginContext.Provider
					value={{ authenticationPromptOpen, setAuthenticationPromptOpen }}
				>
					<AuthenticationPrompt />
					<Snackbar
						autoHideDuration={snackbarColor == "success" ? 3000 : null}
						open={snackbarOpen}
						onClose={() => {
							setSnackbarOpen(false);
						}}
						message="Note archived"
						anchorOrigin={{ vertical: "top", horizontal: "right" }}
					>
						<Alert
							color={snackbarColor}
							sx={{
								width: "40vw",
								minHeight: "5rem",
								alignItems: "flex-start",
							}}
							severity={snackbarColor || "success"}
							variant="filled"
						>
							<AlertTitle>{snackbarTitle}</AlertTitle>
							{snackbarMessage}
						</Alert>
					</Snackbar>
					<Router>
						<Routes>
							<Route path="/" element={<CustomAppBar content={<Home />} />} />
							<Route
								path="/test"
								elemen={<CustomAppBar content={<Home />} />}
							/>
						</Routes>
					</Router>
				</LoginContext.Provider>
			</SnackbarContext.Provider>
		</ThemeProvider>
	);
}

export default App;
