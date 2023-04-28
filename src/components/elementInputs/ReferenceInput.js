import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import Reference from "../../classes/specialTypes/Reference";
import { searchReference } from "../../utilities/querying/query";
import CodeInput from "../primitiveInputs/CodeInput";

/**
 * Input Component for a reference. Will fetch resources to be proposed as options in an Autocomplete input.
 * @param {*} referenceOptions Object of the form {'resourceType1': {...options}, 'resourceType2': {...options}, .....}
 * with options including displayAttribute (name of element which to use to display the reference in the Autompletelist), calculateDisplayAttribute (callback function if displayAttribute not given), paramsAndModifiers (List of strings of searchparameters and modifiers).
 * Refer to the Linkinput Component for an example.
 */
const ReferenceInput = ({
	reference,
	changeReference,
	referenceOptions,
	...rest
}) => {
	// which resource is selected as a reference
	const [selectedValue, setSelectedValue] = useState(null);

	// of which type selected the reference is
	const [selectedResourceType, setSelectedResourceType] = useState(
		reference
			? reference.type
				? reference.type
				: Object.keys(referenceOptions)[0]
			: Object.keys(referenceOptions)[0]
	);

	// Object storing the offered resources of the available resource types
	const [searchResults, setSearchResults] = useState(() => {
		let r = {};
		Object.keys(referenceOptions).forEach((key) => {
			r[key] = null;
		});
		return r;
	});

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		// every time the resourcetype of which to choose a reference from is changed,
		// fetch the options to choose from
		if (!searchResults || !selectedResourceType) return; //on first render, those are not initialized in state yet -> skip this time
		if (searchResults[selectedResourceType] == null)
			// if still in initial state => fetch options for this type
			fetchOptions(selectedResourceType);
		else if (searchResults[selectedResourceType].length == 0) {
			// no matches -> no value selected.
			handleSelectedValueChange(null);
		}
	}, [selectedResourceType]);

	useEffect(() => {
		// every time the list of options to choose from changes (after being fetched)
		// check if the reference value supplied by the resource is in that list and if so, select it.
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
		} else {
			handleSelectedValueChange(null);
		}
	}, [searchResults]);

	const fetchOptions = async () => {
		// helperfunction to fetch the resources that can serve as a reference.
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
			setSearchResults((prev) => {
				return { ...prev, [selectedResourceType]: x };
			});
			setLoading(false);
		}
	};

	const handleSelectedValueChange = (newVal) => {
		// function to set the state of the selected resource to a deserialized object of type "Reference"
		if (newVal) {
			let newRef = new Reference({
				type: newVal.resourceType,
				reference: newVal.id ? `${newVal.resourceType}/` + newVal.id : null,
				display: newVal.displayLabel,
				internalReactID: reference.internalReactID,
			});
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
		setSelectedResourceType(newVal);
	};

	// render section

	return (
		<Box sx={{ display: "flex" }}>
			<CodeInput
				values={Object.keys(referenceOptions)}
				v={selectedResourceType}
				changeInput={handleTypeChange}
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
					return option.id ? option.id.slice(9) : "unknown ID"; // slicing 9 characters-> will result in display bug with non-uuid IDs
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
