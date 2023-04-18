import { TextField } from "@mui/material";
import React from "react";

const Testfield = ({ val, changeVal }) => {
	return (
		<TextField
			value={val}
			onChange={(e) => {
				changeVal(e.target.value);
			}}
		/>
	);
};

export default Testfield;
