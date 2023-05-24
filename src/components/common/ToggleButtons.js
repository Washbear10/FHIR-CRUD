import * as React from "react";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Box, Button, Typography, styled } from "@mui/material";
import { useState } from "react";
import { SearchButton } from "../styledComponents/SearchButton";

const StyledToggleButton = styled(ToggleButton)({
	"&.MuiToggleButtonGroup-grouped": {
		borderRadius: "10px !important",
		border: "none",
	},
});
export default function ToggleButtons({
	selectedSearchResource,
	updateSelectedSearchResource,
}) {
	return (
		<Box>
			<SearchButton
				onClick={() => {
					updateSelectedSearchResource("Patient");
				}}
				color={selectedSearchResource == "Patient" ? "primary" : "secondary"}
				sx={{ fontSize: "1rem" }}
				disableElevation
				disableFocusRipple
				disableTouchRipple
				disableRipple
			>
				Patient
			</SearchButton>
			<Typography component={"span"}>/</Typography>
			<SearchButton
				onClick={() => {
					updateSelectedSearchResource("Organization");
				}}
				color={
					selectedSearchResource == "Organization" ? "primary" : "secondary"
				}
				sx={{ fontSize: "1rem" }}
				disableElevation
				disableFocusRipple
				disableTouchRipple
				disableRipple
			>
				Organization
			</SearchButton>
		</Box>
	);
}
