import React from "react";
import { Box } from "@mui/system";
import { Stack } from "@mui/system";
import { Typography } from "@mui/material";
const IdentifierDisplay = ({ identifier }) => {
	return (
		<Typography>
			{identifier.system ? <i>{identifier.system + ": "}</i> : null}
			{identifier.value ? identifier.value : null}
		</Typography>
	);
};

export default IdentifierDisplay;
