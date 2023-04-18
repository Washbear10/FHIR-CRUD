import React, { useState } from "react";
import { searchReference } from "../../utilities/query";
import CodeInput from "../primitiveInputs/CodeInput";
import SmallTextField from "../styledComponents/SmallTextField";
import { Box } from "@mui/system";
import Reference from "../../classes/specialTypes/Reference";
import { Autocomplete, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import { isObjectEmptyRecursive } from "../../utilities/fhirify";
import { TextField } from "@mui/material";
const ReferenceInput = ({ reference, changeReference, referenceOptions }) => {
	const [selectedValue, setSelectedValue] = useState(null);
	const [selectedResourceType, setSelectedResourceType] = useState(
		reference
			? reference.type
				? reference.type
				: Object.keys(referenceOptions)[0]
			: Object.keys(referenceOptions)[0]
	);
	const [searchResults, setSearchResults] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchOptions("");
	}, [selectedResourceType]);

	useEffect(() => {
		if (searchResults) {
			searchResults.map((item) => {
				if (item.id == reference.reference) {
					console.log(reference.display);
					item.displayLabel = reference.display;
					setSelectedValue(item);
				}
			});
			//setLoading(false);
		}
	}, [searchResults]);

	const fetchOptions = async (searchValue) => {
		if (searchValue !== null) {
			setLoading(true);
			let valueInsertedToParams = referenceOptions[
				selectedResourceType
			].paramsAndModifiers
				.map((item) => item + "=" + searchValue)
				.join("&");
			const response = await searchReference(
				selectedResourceType,
				valueInsertedToParams
			);
			let x = response.map((resource) => {
				let displayLabel;
				if (
					Object.keys(referenceOptions[selectedResourceType]).includes(
						"calculateDisplayAttribute"
					)
				) {
					displayLabel =
						referenceOptions[selectedResourceType].calculateDisplayAttribute(
							resource
						);
				} else {
					displayLabel =
						resource[referenceOptions[selectedResourceType].displayAttribute];
				}
				return {
					id: resource.id,
					displayLabel: displayLabel, //TODO: generalize
					resourceType: resource.resourceType,
				};
			});
			setSearchResults(x);
			setLoading(false);
		}
	};

	const handleSelectedValueChange = (newVal) => {
		if (newVal) {
			console.log("old ref: ", reference);
			let newRef = new Reference({
				type: newVal.resourceType,
				reference: newVal.id,
				display: newVal.displayLabel,
				internalReactID: reference.internalReactID,
			});
			console.log("new ref: ", newRef);

			setSelectedValue(newVal);
			changeReference(newRef, reference);
		} else {
			setSelectedValue("");
			changeReference(new Reference({}), reference);
		}
	};

	const handleTypeChange = (newVal) => {
		//setLoading(true);
		setSearchResults([]);
		setSelectedResourceType(newVal);
	};

	return (
		<Box sx={{ display: "flex" }}>
			<CodeInput
				values={Object.keys(referenceOptions)}
				v={selectedResourceType}
				changeInput={handleTypeChange}
				/* readOnly={Object.keys(referenceOptions).length <= 1} */
				label="Resource type"
				disabledCursor={Object.keys(referenceOptions).length <= 1}
				disabled={Object.keys(referenceOptions).length <= 1}
			/>
			<CodeInput
				v={selectedValue}
				values={searchResults}
				changeInput={handleSelectedValueChange}
				disabled={!selectedResourceType}
				label={selectedResourceType}
				clearOnBlur={true}
				renderOption={(props, option) => (
					<Box
						component="li"
						{...props}
						sx={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "start",
							alignItems: "start",
						}}
						key={option.id}
					>
						{option.displayLabel ? (
							<Typography variant="subtitle1">{option.displayLabel}</Typography>
						) : (
							<Typography variant="subtitle2">(unnamed)</Typography>
						)}
						<Typography variant="subtitle2">{option.id}</Typography>
					</Box>
				)}
				getOptionLabel={(option) => {
					return option.displayLabel || option.id;
				}}
				loading={loading}
			/>
		</Box>
	);
};

export default ReferenceInput;
