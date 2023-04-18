import CustomAppBar from "./components/CustomAppBar";
import Home from "./pages/Home/Home";
import "./App.css";
import { useState, useEffect } from "react";
import { medplum } from "./index";

import { createTheme } from "@mui/material/styles";
import * as colors from "@mui/material/colors";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import dayjs from "dayjs";
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
	const [authorized, setAuthorized] = useState(true);

	return (
		<ThemeProvider theme={theme}>
			<CustomAppBar content={<Home />} />
		</ThemeProvider>
	);
}

export default App;
