import { Typography } from "@mui/material";
import React, { useState } from "react";
import { Stack } from "@mui/system";

const HumanNameDisplay = ({ humanName }) => {
	/* 	const [displayString, setDisplayString] = useState(
		calcDisplayString(humanName)
	); */
	const calcDisplayString = (name) => {
		let s = "";
		name.prefix.forEach((pf) => {
			s += pf + " ";
		});
		if (name.family) s += name.family;
		if (name.given) if (name.family) s += ", ";
		s += name.given.reduce((acc, curr) => acc + " " + curr, "");
		return s;
	};
	return <Typography>{calcDisplayString(humanName)}</Typography>;
};

export default HumanNameDisplay;
