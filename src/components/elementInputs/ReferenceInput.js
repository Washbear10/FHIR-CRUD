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
const ReferenceInput = ({
	reference,
	changeReference,
	referenceOptions,
	...rest
}) => {
	const [selectedValue, setSelectedValue] = useState(null);
	const [selectedResourceType, setSelectedResourceType] = useState(
		reference
			? reference.type
				? reference.type
				: Object.keys(referenceOptions)[0]
			: Object.keys(referenceOptions)[0]
	);
	const [searchResults, setSearchResults] = useState(() => {
		let r = {};
		Object.keys(referenceOptions).forEach((key) => {
			r[key] = null;
		});
		return r;
	});
	const [loading, setLoading] = useState(false);

	const wasMounted = useRef(false);

	useEffect(() => {
		if (!searchResults || !selectedResourceType) return; //on first render, those are not initialized in state yet -> skip this time

		if (searchResults[selectedResourceType] == null)
			fetchOptions(selectedResourceType);
		else if (searchResults[selectedResourceType].length == 0) {
			handleSelectedValueChange(null);
		}
	}, [selectedResourceType]);

	useEffect(() => {
		/* if (!wasMounted) {
			wasMounted.current = true;
			return;
		} */
		if (!selectedResourceType || !searchResults[selectedResourceType]) return;
		if (!reference.reference) return;
		if (searchResults[selectedResourceType].length > 0) {
			console.log("searchresults: ", searchResults);
			let foundValue = false;
			searchResults[selectedResourceType].forEach((item) => {
				if (
					item.id ==
					reference.reference.substring(
						reference.reference.lastIndexOf("/") + 1
					)
				) {
					console.log(reference.display);
					item.displayLabel = reference.display;
					setSelectedValue(item);
					foundValue = true;
				}
			});
			if (!foundValue) {
				handleSelectedValueChange(null);
			}
			//setLoading(false);
		} else {
			handleSelectedValueChange(null);
		}
	}, [searchResults]);

	const fetchOptions = async () => {
		console.log("fetching options");
		if (selectedResourceType !== null) {
			setLoading(true);
			const response = await searchReference(selectedResourceType);
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
					displayLabel: displayLabel,
					resourceType: resource.resourceType,
				};
			});
			console.log("x is: ", x);
			setSearchResults((prev) => {
				return { ...prev, [selectedResourceType]: x };
			});
			setLoading(false);
		}
	};

	const handleSelectedValueChange = (newVal) => {
		if (newVal) {
			console.log("old ref: ", reference);
			let newRef = new Reference({
				type: newVal.resourceType,
				reference: newVal.id ? `${newVal.resourceType}/` + newVal.id : null,
				display: newVal.displayLabel,
				internalReactID: reference.internalReactID,
			});
			console.log("new ref: ", newRef);
			setSelectedValue(newVal);
			changeReference(newRef, reference);
		} else {
			setSelectedValue("");
			changeReference(
				new Reference({ internalReactID: reference.internalReactID }),
				reference
			);
		}
	};

	const handleTypeChange = (newVal) => {
		//setLoading(true);
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
				mycursordisabled={Object.keys(referenceOptions).length <= 1}
				disabled={Object.keys(referenceOptions).length <= 1}
				disableClearable
			/>
			<CodeInput
				v={selectedValue}
				values={searchResults[selectedResourceType]}
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
					if (option.displayLabel) return option.displayLabel;
					return option.id ? option.id.slice(9) : "unknown ID";
				}}
				loading={loading}
				width={"500px"}
				error={rest.error ? 1 : 0}
				helpertext={rest.helpertext}
			/>
		</Box>
	);
};

export default ReferenceInput;
