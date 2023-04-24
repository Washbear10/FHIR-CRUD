import React, { memo } from "react";
import SmallTextField from "../styledComponents/SmallTextField";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import CodingInput from "./CodingInput";
import { useEffect } from "react";
import { useState } from "react";
import CodeableConcept from "../../classes/dataTypes/CodeableConcept";
import Coding from "../../classes/dataTypes/Coding";
import Subcomponent from "../common/Subcomponent";
import DeleteableComponent from "../common/DeleteableComponent";
import ExtendableComponent from "../common/ExtendableComponent";
import { isObjectEmptyRecursive } from "../../utilities/fhirify";
import { Button } from "@mui/material";
import CodeInput from "../primitiveInputs/CodeInput";
import { commonLanguages } from "../../utilities/valueSets/commonLanguages";
const CodeableConeptInput = ({
	codeableConcept,
	changeCodeableConcept,
	...rest
}) => {
	useEffect(() => {}, []);

	const handleChangeText = (newValue) => {
		let newCodeableConcept = new CodeableConcept({
			...codeableConcept,
			text: newValue ? newValue : null,
		});
		changeCodeableConcept(newCodeableConcept);
	};

	const handleChangeTextCode = (newValue) => {
		let newCodeableConcept = new CodeableConcept({
			...codeableConcept,
			text: newValue ? newValue : null,
		});
		changeCodeableConcept(newCodeableConcept);
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
			changeCodeableConcept(newCodeableConcept);
		} else if (codeableConcept) {
			let newCodeableConcept = new CodeableConcept({
				...codeableConcept,
				coding: [newCoding],
			});
			changeCodeableConcept(newCodeableConcept);
		} else {
			changeCodeableConcept(new CodeableConcept({ coding: [newCoding] }));
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
		changeCodeableConcept(newCodeableConcept);
	};

	const handleAddCoding = () => {
		let newCodings = [...codeableConcept.coding];
		newCodings.push(new Coding({}));
		let newCodeableConcept = new CodeableConcept({
			...codeableConcept,
			coding: newCodings,
		});
		changeCodeableConcept(newCodeableConcept);
	};

	const filterOptions = createFilterOptions({
		limit: 5,
	});
	return (
		<Box sx={{ display: "flex", rowGap: "10px", flexDirection: "column" }}>
			{Object.keys(rest).includes("textValueSet") ? (
				<CodeInput
					v={codeableConcept.text}
					values={Object.keys(rest["textValueSet"])}
					changeInput={(newValue) => {
						/* handleChangeTextCode(rest["textValueSet"][newValue]); */
						handleChangeTextCode(newValue);
					}}
					label={"Text"}
					clearOnBlur={true}
					renderOption={(props, option) => (
						<Box
							component="li"
							{...props}
							sx={{ display: "flex", justifyContent: "start", gap: "1rem" }}
							key={option}
						>
							<Typography variant="subtitle1">{option}</Typography>
							<Typography variant="subtitle2">
								{rest["textValueSet"][option]}
							</Typography>
						</Box>
					)}
					/* filterOptions={(options, inputval) => {
						let filtered = options.filter((option) => {
							return (
								option
									.toLowerCase()
									.includes(inputval.inputValue.toLowerCase()) ||
								rest["textValueSet"][option]
									.toLowerCase()
									.includes(inputval.inputValue.toLowerCase())
							);
						});
						return filtered;
					}} */
					filter
					getOptionLabel={(option) => {
						return option + " (" + rest["textValueSet"][option] + ")";
					}}
					width={"500px"}
					/* error={rest.error}
					helperText={rest.helperText} */
				/>
			) : (
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
			)}
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
									.map((codeableConcept) => (
										<Box key={codeableConcept.key}>
											<DeleteableComponent
												title="Delete this coding"
												handleDelete={() => {
													handleDeleteCoding(codeableConcept.index);
												}}
												disabled={
													codeableConcept.coding.length == 1 &&
													isObjectEmptyRecursive(codeableConcept.coding)
												}
											>
												<CodingInput
													coding={codeableConcept.coding}
													changeCoding={handleChangeCoding}
													key={codeableConcept.key}
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
/* function areEqual(prev, next) {
	return prev.codeableConcept == next.codeableConcept;
}
export default memo(CodeableConeptInput, areEqual); */
