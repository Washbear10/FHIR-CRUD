import { Box } from "@mui/system";
import React from "react";
import Communication from "../../classes/dataTypes/Communication";
import BooleanInput from "../primitiveInputs/BooleanInput";
import CodeableConeptInput from "./CodeableConeptInput";

const CommunicationInput = ({ communication, changeCommunication }) => {
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
			<CodeableConeptInput
				codeableConcept={communication.language}
				changeCodeableConcept={handleChangeLanguage}
			/>
			<BooleanInput
				title="preferred?"
				checked={communication.preferred}
				changeChecked={handleChangePreferred}
			/>
		</Box>
	);
};

export default CommunicationInput;
