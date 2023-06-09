import { Box } from "@mui/system";
import React, { useContext, useEffect, useRef, useState } from "react";
import Communication from "../../classes/dataTypes/Communication";
import { isObjectEmptyRecursive } from "../../utilities/formatting/fhirify";
import { AttributeBlockErrorContext } from "../../utilities/other/Contexts";
import Subcomponent from "../common/Subcomponent";
import BooleanInput from "../primitiveInputs/BooleanInput";
import CodeableConeptInput from "./CodeableConeptInput";
import { commonLanguages } from "../../utilities/valueSets/valueSets";

const CommunicationInput = ({ communication, changeCommunication }) => {
	// Error display section
	const [errorMessage, setErrorMessage] = useState("");
	const {
		attributeBlockError,
		setAttributeBlockError,
		attributeBlockErrorMessage,
		setAttributeBlockErrorMessage,
	} = useContext(AttributeBlockErrorContext);

	// Section for checking validity of inputs
	//
	const wasMounted = useRef(false);
	useEffect(() => {
		if (!wasMounted) {
			wasMounted.current = true;
			return;
		}
		checkValidity();
	}, [communication]);

	const checkValidity = () => {
		// checks if constraints of Resource / element are adhered to
		if (!isObjectEmptyRecursive(communication)) {
			if (
				communication.language.coding.some((item) => !item.system || !item.code)
			) {
				setAttributeBlockError(true);
				setAttributeBlockErrorMessage(
					"If a communication is supplied, a language code must be selected."
				);
				setErrorMessage(
					"If a communication is supplied, a language code must be selected."
				);
			} else {
				setAttributeBlockError(false);
				setAttributeBlockErrorMessage("");
				setErrorMessage("");
			}
		} else {
			setAttributeBlockError(false);
			setAttributeBlockErrorMessage("");
			setErrorMessage("");
		}
	};

	// Section for handling changing data
	//
	const handleChangePreferred = (newChecked) => {
		let newCom = new Communication({ ...communication, preferred: newChecked });
		changeCommunication(newCom, communication);
	};
	const handleChangeLanguage = (newVal) => {
		changeCommunication(
			new Communication({ ...communication, language: newVal }),
			communication
		);
	};

	// render Section
	//
	return (
		<Box>
			<Subcomponent title="Language">
				<CodeableConeptInput
					codeableConcept={communication.language}
					changeCodeableConcept={handleChangeLanguage}
					defaultSystem="urn:ietf:bcp:47"
					codesLink="http://hl7.org/fhir/R4/valueset-languages.html#definition"
					bindingCodes={Object.keys(commonLanguages)}
					systemUneditable={true}
					systemValueCombinationRequired={true}
				/>
			</Subcomponent>
			<BooleanInput
				title="preferred?"
				checked={communication.preferred}
				changeChecked={handleChangePreferred}
			/>
		</Box>
	);
};

export default CommunicationInput;
