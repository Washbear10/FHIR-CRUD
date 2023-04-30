import { createContext } from "react";

// Various contexts needed deep down as well as high up the Component tree hirarchy
export const AttributeBlockErrorContext = createContext({
	attributeBlockError: false,
	setAttributeBlockError: () => {},
	attributeBlockErrorMessage: "",
	setAttributeBlockErrorMessage: () => {},
});

export const AttributeBlockWarningContext = createContext({
	attributeBlockWarning: false,
	setAttributeBlockWarning: () => {},
	attributeBlockWarningMessage: "",
	setAttributeWarningErrorMessage: () => {},
});

export const LoginContext = createContext({
	authenticationPromptOpen: false,
	setAuthenticationPromptOpen: () => {},
});

export const SnackbarContext = createContext({
	snackbarOpen: false,
	setSnackbarOpen: () => {},
	snackbarColor: "",
	setSnackbarColor: () => {},
	snackbarMessage: "",
	setSnackbarMessage: () => {},
	snackbarTitle: "",
	setSnackbarTitle: () => {},
});
