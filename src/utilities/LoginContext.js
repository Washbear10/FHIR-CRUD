import { createContext } from "react";

export const LoginContext = createContext({
	authenticationPromptOpen: false,
	setAuthenticationPromptOpen: () => {},
});
