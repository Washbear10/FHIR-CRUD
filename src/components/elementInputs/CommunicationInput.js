import { Box } from "@mui/system";
import React from "react";
import Communication from "../../classes/dataTypes/Communication";
import { commonLanguages } from "../../utilities/valueSets/commonLanguages";
import Subcomponent from "../common/Subcomponent";
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
			<Subcomponent title="Language">
				<CodeableConeptInput
					codeableConcept={communication.language}
					changeCodeableConcept={handleChangeLanguage}
					textValueSet={commonLanguages}
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
