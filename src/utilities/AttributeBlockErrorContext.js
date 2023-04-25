import { createContext } from "react";

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
