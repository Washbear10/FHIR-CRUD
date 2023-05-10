import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import CodeableConcept from "../../classes/dataTypes/CodeableConcept";
import Coding from "../../classes/dataTypes/Coding";
import { isObjectEmptyRecursive } from "../../utilities/formatting/fhirify";
import DeleteableComponent from "../common/DeleteableComponent";
import ExtendableComponent from "../common/ExtendableComponent";
import Subcomponent from "../common/Subcomponent";
import CodeInput from "../primitiveInputs/CodeInput";
import SmallTextField from "../styledComponents/SmallTextField";
import CodingInput from "./CodingInput";

/**
 * Component for a codeableConcept element.
 * @param {*} defaultSystem String representing the default system passed down to the Coding component
 * @param {*} systemUneditable Is defaultSystem required?
 * @param {*} bindingCodes The valueset codes that the data to represent must adhere to (passed down to Coding)
 * @param {*} systemValueCombinationRequired Can system and value in Coding not be supplied exclusively?
 */
const CodeableConeptInput = ({
	codeableConcept,
	changeCodeableConcept,
	defaultSystem,
	systemUneditable,
	bindingCodes,
	systemValueCombinationRequired,
	...rest
}) => {
	useEffect(() => {}, []);

	// Section for methods handling change in data:
	//
	const handleChangeText = (newValue) => {
		let newCodeableConcept = new CodeableConcept({
			...codeableConcept,
			text: newValue ? newValue : null,
		});
		changeCodeableConcept(newCodeableConcept, codeableConcept);
	};

	const handleChangeTextCode = (newValue) => {
		let newCodeableConcept = new CodeableConcept({
			...codeableConcept,
			text: newValue ? newValue : null,
		});
		changeCodeableConcept(newCodeableConcept, codeableConcept);
	};
	const handleChangeCoding = (newCoding, oldCoding) => {
		if (codeableConcept.coding) {
			const i = codeableConcept.coding.indexOf(oldCoding);
			let newCodeableConcept;
			if (i === -1) {
				newCodeableConcept = new CodeableConcept({
					...codeableConcept,
					coding: [newCoding],
				});
			} else {
				let newCodings = [...codeableConcept.coding];
				newCodings[i] = newCoding;
				newCodeableConcept = new CodeableConcept({
					...codeableConcept,
					coding: newCodings,
				});
			}
			changeCodeableConcept(newCodeableConcept, codeableConcept);
		} else if (codeableConcept) {
			let newCodeableConcept = new CodeableConcept({
				...codeableConcept,
				coding: [newCoding],
			});
			changeCodeableConcept(newCodeableConcept, codeableConcept);
		} else {
			changeCodeableConcept(
				new CodeableConcept({ coding: [newCoding] }),
				codeableConcept
			);
		}
	};

	const handleDeleteCoding = (index) => {
		let newCodings = [...codeableConcept.coding];
		newCodings.splice(index, 1);
		if (newCodings.length == 0) newCodings.push(new Coding({}));
		let newCodeableConcept = new CodeableConcept({
			...codeableConcept,
			coding: newCodings,
		});
		changeCodeableConcept(newCodeableConcept, codeableConcept);
	};

	const handleAddCoding = () => {
		let newCodings = [...codeableConcept.coding];
		newCodings.push(new Coding({}));
		let newCodeableConcept = new CodeableConcept({
			...codeableConcept,
			coding: newCodings,
		});
		changeCodeableConcept(newCodeableConcept, codeableConcept);
	};

	// render Section:
	return (
		<Box sx={{ display: "flex", rowGap: "10px", flexDirection: "column" }}>
			<SmallTextField
				value={
					codeableConcept
						? codeableConcept.text
							? codeableConcept.text
							: ""
						: ""
				}
				label="Text"
				onChange={(e) => {
					handleChangeText(e.target.value);
				}}
			/>

			<Subcomponent
				title={"coding"}
				description="Code defined by a terminology system"
			>
				<ExtendableComponent
					title="Add coding"
					handleExtend={() => {
						handleAddCoding();
					}}
				>
					{codeableConcept
						? codeableConcept.coding
							? codeableConcept.coding
									.map((coding, index) => {
										return {
											coding: coding,
											key: coding.internalReactID,
											index: index,
										};
									})
									.map((coding) => (
										<Box key={coding.key}>
											<DeleteableComponent
												title="Delete this coding"
												handleDelete={() => {
													handleDeleteCoding(coding.index);
												}}
												disabled={
													codeableConcept.coding.length == 1 &&
													isObjectEmptyRecursive(coding.coding)
												}
											>
												<CodingInput
													coding={coding.coding}
													changeCoding={handleChangeCoding}
													defaultSystem={defaultSystem}
													bindingCodes={bindingCodes}
													key={coding.key}
													systemUneditable={systemUneditable}
													systemValueCombinationRequired={
														systemValueCombinationRequired
													}
													clearOnBlur={rest["clearOnBlur"]}
												/>
											</DeleteableComponent>
										</Box>
									))
							: null
						: null}
				</ExtendableComponent>
			</Subcomponent>
		</Box>
	);
};

export default CodeableConeptInput;
