import { Box } from "@mui/system";
import React, { useContext, useEffect, useRef, useState } from "react";
import Communication from "../../classes/dataTypes/Communication";
import { AttributeBlockErrorContext } from "../../utilities/AttributeBlockErrorContext";
import { isObjectEmptyRecursive } from "../../utilities/fhirify";
import { commonLanguages } from "../../utilities/valueSets/commonLanguages";
import Subcomponent from "../common/Subcomponent";
import BooleanInput from "../primitiveInputs/BooleanInput";
import CodeableConeptInput from "./CodeableConeptInput";

const CommunicationInput = ({ communication, changeCommunication }) => {
	const [errorMessage, setErrorMessage] = useState("");

	const {
		attributeBlockError,
		setAttributeBlockError,
		attributeBlockErrorMessage,
		setAttributeBlockErrorMessage,
	} = useContext(AttributeBlockErrorContext);

	const wasMounted = useRef(false);

	useEffect(() => {
		if (!wasMounted) {
			wasMounted.current = true;
			return;
		}
		checkValidity();
	}, [communication]);

	const checkValidity = () => {
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
	return (
		<Box>
			<Subcomponent title="Language">
				<CodeableConeptInput
					codeableConcept={communication.language}
					changeCodeableConcept={handleChangeLanguage}
					defaultSystem="urn:ietf:bcp:47"
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
