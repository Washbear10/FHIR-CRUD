import React from "react";
import { Box } from "@mui/system";
import { Stack } from "@mui/system";
import { Typography } from "@mui/material";
const IdentifierDisplay = ({ identifier }) => {
	return (
		<Stack>
			{identifier.map((singleIdentifier) => (
				<Typography>
					{singleIdentifier.system ? (
						<i>{singleIdentifier.system + ": "}</i>
					) : null}
					{singleIdentifier.value ? singleIdentifier.value : null}
				</Typography>
			))}
		</Stack>
	);
};

export default IdentifierDisplay;
