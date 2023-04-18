import React from "react";
import { useState } from "react";
import { Box } from "@mui/system";
import { Autocomplete } from "@mui/material";
import { TextField } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClearIcon from "@mui/icons-material/Clear";
import { useEffect } from "react";
import { DisabledTextField } from "../styledComponents/DisabledTextfield";
const CodeInput = ({ values, v, label, changeInput, width, ...rest }) => {
	/* 	useEffect(() => {
		
		
	}, [values, value]); */

	return (
		<Autocomplete
			options={values}
			size="small"
			value={values ? (values.includes(v) ? v : null) : null}
			onChange={(event, newValue, reason) => {
				changeInput(newValue);
			}}
			sx={{
				maxWidth: width ? width : "200px",
				backgroundColor: "white",
				"& .MuiAutocomplete-popupIndicator": {
					fontSize: "16px",
				},
				".MuiAutocomplete-clearIndicator": {
					fontSize: "16px",
					color: "red",
					backgroundColor: "rgba(250,250,250,0.9)",
				},
				".MuiAutocomplete-input": {
					textOverflow: "clip",
					overflow: "scroll",
					padding: "0",
				},
				"& .MuiOutlinedInput-root": {
					paddingRight: "5px !important",
				},
			}}
			fullWidth
			popupIcon={<ArrowDropDownIcon size="small" fontSize="16px" />}
			clearIcon={<ClearIcon size="small" fontSize="16px" />}
			renderInput={
				!Object.keys(rest).includes("disabledCursor")
					? (params) => (
							<TextField
								{...params}
								label={label}
								sx={{
									textOverflow: "clip",
									overflow: "visible",
								}}
							/>
					  )
					: (params) => (
							<DisabledTextField
								{...params}
								label={label}
								sx={{
									textOverflow: "clip",
									overflow: "visible",
								}}
							/>
					  )
			}
			{...rest}
		/>
	);
};

export default CodeInput;
