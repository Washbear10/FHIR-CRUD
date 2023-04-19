import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Box } from "@mui/system";
import { useState } from "react";
import { IconButton } from "@mui/material";
import { Button, FormControl } from "@mui/material";
import CloseTwoToneIcon from "@mui/icons-material/CloseTwoTone";
import { CssBaseline } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { FormControlLabel } from "@mui/material";
import { FormGroup } from "@mui/material";
import { allResources, getToken } from "../utilities/query";

const searchBarWidth = 600;
const SearchForm = ({
	onSubmit,
	resourceList,
	updateResourceList,
	inputValue,
	updateInputValue,
	limit,
	updateLimit,
	filterResource,
	updateFilterResource,
}) => {
	function handleLimitChange(event) {
		const input = parseInt(event.target.value);
		if (event.target.value == "") updateLimit("");
		if (!isNaN(input)) {
			updateLimit(Math.abs(input));
		}
	}

	function handleDeleteResource(resource) {
		const newResourceList = resourceList.filter((item) => item != resource);
		updateResourceList(newResourceList);
	}

	return (
		<Box component={"form"} onSubmit={onSubmit}>
			<Box
				sx={{
					display: "flex",
					gap: "1rem",
					flexDirection: "column",
				}}
			>
				<Box
					sx={{
						display: "flex",
						height: {
							xs: "fit-content",
							sm: "56px",
						},
						flexDirection: {
							xs: "column",
							sm: "row",
						},
					}}
				>
					<Autocomplete
						id="free-solo-demo"
						freeSolo
						sx={{
							width: {
								xs: "100%",
								sm: `${searchBarWidth}px`,
							},
							marginX: "auto",
						}}
						options={[]}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Search"
								value={inputValue}
								onChange={(event) => {
									updateInputValue(event.target.value);
								}}
							/>
						)}
					/>
				</Box>
				<FormGroup>
					<FormControlLabel
						sx={{ width: "fit-content", marginBottom: "-1rem" }}
						control={
							<Checkbox
								checked={filterResource}
								onClick={() => updateFilterResource(!filterResource)}
							/>
						}
						label="Filter Resource type"
					/>
				</FormGroup>
				<Box
					sx={{
						display: "flex",
						height: {
							xs: "fit-content",
							sm: "56px",
						},
						flexDirection: {
							xs: "column",
							sm: "row",
						},
						marginBottom: "1rem",
					}}
				>
					<Autocomplete
						id="free-solo-demo"
						disabled={!filterResource}
						sx={{
							minWidth: {
								xs: "100%",
								sm: `${searchBarWidth / 2}px`,
							},
						}}
						options={allResources}
						onChange={(e, newValue) => {
							if (newValue)
								updateResourceList([...new Set([...resourceList, newValue])]);
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Resource type"
								value={inputValue}
								onChange={(event) => {
									updateInputValue(event.target.value);
								}}
							/>
						)}
					/>

					<Box
						sx={{
							color: filterResource ? "black" : "rgba(100,100,100,0.5)",
							display: "flex",
							flexDirection: { xs: "row", sm: "column" },
							marginLeft: { xs: "0px", sm: "10px" },
							flexWrap: "wrap",
							gap: "3px 1rem",
							justifyContent: { xs: "space-between", sm: "space-between" },
							alignContent: "flex-start",
							height: "100%",
							marginTop: {
								xs: "10px",
								sm: "0",
							},
							width: "100%",
							overflowX: "overlay",
							paddingBottom: "1rem",
							scrollbarWidth: "thin",
						}}
					>
						{resourceList.map((resource) => (
							<Box
								key={resource}
								sx={{
									color: filterResource ? "black" : "rgba(100,100,100,0.5)",
									border: "1px solid rgba(100,100,100,0.5)",
									paddingRight: { xs: "0px", sm: "10px" },
									paddingY: "1px",
									borderRadius: "4px",
									display: "flex",
									justifyContent: "space-between",
									maxWidth: "fit-content",
								}}
							>
								<IconButton
									sx={{
										padding: "0px",
									}}
									disabled={!filterResource}
									onClick={() => handleDeleteResource(resource)}
								>
									<CloseTwoToneIcon
										fontSize="small"
										color={filterResource ? "error" : "rgba(100,100,100,0.5)"}
									/>
								</IconButton>
								<span>{resource}</span>
							</Box>
						))}
					</Box>
				</Box>
				<Box
					sx={{
						width: `${searchBarWidth}px`,
						display: "flex",
						justifyContent: "space-end",
						gap: "10px",
					}}
				>
					<Button variant="contained" type="submit">
						Search
					</Button>

					<FormControl>
						<TextField
							id="filled-number"
							size="small"
							label="Limit"
							value={limit}
							onBlur={() => {
								if (limit == "0" || limit == "") updateLimit("-");
							}}
							onFocus={() => {
								if (limit == "-") updateLimit("");
							}}
							sx={{ maxWidth: "5rem" }}
							InputLabelProps={{
								shrink: true,
							}}
							onInput={handleLimitChange}
							variant="filled"
						/>
					</FormControl>
				</Box>
			</Box>
		</Box>
	);
};

export default SearchForm;