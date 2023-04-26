import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClearIcon from "@mui/icons-material/Clear";
import { Autocomplete, TextField } from "@mui/material";
import React from "react";
import { DisabledTextField } from "../styledComponents/DisabledTextfield";
const CodeInput = ({
	values,
	v,
	label,
	changeInput,
	width,
	mycursordisabled,
	...rest
}) => {
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
				".MuiAutocomplete-input": Object.keys(rest).includes("textOverflow")
					? {
							textOverflow: rest["textOverflow"],
							overflow: "scroll",
							padding: "0",
					  }
					: {
							textOverflow: "clip",
							overflow: "scroll",
							padding: "0",
					  },
				"& .MuiOutlinedInput-root": {
					paddingRight: "5px !important",
				},
				"& .MuiFormHelperText-root": {},
			}}
			fullWidth
			popupIcon={<ArrowDropDownIcon size="small" fontSize="16px" />}
			clearIcon={<ClearIcon size="small" fontSize="16px" />}
			renderInput={
				!mycursordisabled
					? (params) => (
							<TextField
								{...params}
								label={label}
								sx={{
									textOverflow: "clip",
									overflow: "visible",
								}}
								error={rest.error ? 1 : 0}
								helperText={rest.helpertext}
							/>
					  )
					: (params) => {
							return (
								<DisabledTextField
									{...params}
									disabled
									label={label}
									sx={{
										textOverflow: "clip",
										overflow: "visible",
									}}
								/>
							);
					  }
			}
			{...rest}
		/>
	);
};

export default CodeInput;
