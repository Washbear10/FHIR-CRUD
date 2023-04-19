import { Typography } from "@mui/material";
import React from "react";
import { Stack } from "@mui/system";

const HumanNameDisplay = ({ humanName }) => {
	return (
		<Stack>
			{humanName.map((singleName) => {
				let s = "";
				singleName.prefix.forEach((pf) => {
					s += pf + " ";
				});
				if (singleName.family) s += singleName.family;
				if (singleName.given) if (singleName.family) s += ", ";
				s += singleName.given.reduce((acc, curr) => acc + " " + curr, "");
				return <Typography>{s}</Typography>;
			})}
		</Stack>
	);
};

export default HumanNameDisplay;
