import { InputAdornment, TextField } from "@mui/material";
import React from "react";

const PrefixTextField = ({ prefix, ...props }) => {
	return (
		<TextField
			{...props}
			InputProps={{
				startAdornment: (
					<InputAdornment position="start" sx={{ margin: "0", padding: "0" }}>
						<span style={{ color: "gray" }}>{prefix}</span>
					</InputAdornment>
				),
			}}
		/>
	);
};

export default PrefixTextField;
