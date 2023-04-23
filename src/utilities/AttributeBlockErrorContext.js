import { createContext } from "react";

export const AttributeBlockErrorContext = createContext({
	attributeBlockError: false,
	setAttributeBlockError: () => {},
	attributeBlockErrorMessage: "",
	setAttributeBlockErrorMessage: () => {},
});
