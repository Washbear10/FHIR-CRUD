import { Button, FormControl } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import ToggleButtons from "../../components/common/ToggleButtons";

const searchBarWidth = 500;

/**
 * Component to render the search form. Parts of it (the selection of which resource types to search for) are disabled since only Patient is yet supported.
 * @param {*} resourceList prop to know which resources to render in the selection of resource types.
 * @returns
 */
const SearchForm = ({
	onSubmit,
	selectedSearchResource,
	updateSelectedSearchResource,
}) => {
	// search and limit input
	const [searchLabel, setSearchLabel] = useState("Search Patients by name");
	const [inputValue, setInputValue] = useState("");

	useEffect(() => {
		if (selectedSearchResource == "Patient")
			setSearchLabel("Search Patients by name");
		else if (selectedSearchResource == "Organization")
			setSearchLabel("Search Organization by name");
	}, [selectedSearchResource]);

	// render section
	return (
		<Box
			component={"form"}
			onSubmit={(e) => {
				onSubmit({ event: e, searchValue: inputValue });
			}}
		>
			<Box
				sx={{
					display: "flex",
					flexDirection: {
						xs: "column",
						sm: "row",
					},
					gap: "1rem",
					width: "100%",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<ToggleButtons
					selectedSearchResource={selectedSearchResource}
					updateSelectedSearchResource={(newVal) => {
						updateSelectedSearchResource(newVal);
					}}
				/>
				<TextField
					sx={{
						width: {
							xs: "100%",
							sm: `${searchBarWidth}px`,
						},
					}}
					label={searchLabel}
					value={inputValue}
					onChange={(event) => {
						setInputValue(event.target.value);
					}}
				/>
				<Button variant="contained" type="submit">
					Search
				</Button>
			</Box>
		</Box>
	);
};

export default SearchForm;
