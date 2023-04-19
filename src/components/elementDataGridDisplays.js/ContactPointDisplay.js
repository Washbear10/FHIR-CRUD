import React from "react";
import { Box } from "@mui/system";
import { Stack } from "@mui/system";
import { Typography } from "@mui/material";
const ContactPointDisplay = ({ contactPoint }) => {
	return <Typography>{<i>{contactPoint.value || ""}</i>}</Typography>;
};

export default ContactPointDisplay;
