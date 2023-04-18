import React, { memo } from "react";
import { Box } from "@mui/system";
import { useEffect } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Button, IconButton } from "@mui/material";
const AttributeBlock = ({
	attributeName,
	attributeDescription,
	inputComponents,
	renderKey,
}) => {
	useEffect(() => {});
	return (
		<Box
			sx={{
				display: "flex",
				gap: "1rem",
				flexDirection: "column",
				paddingBottom: "1.5rem",
				paddingX: "1rem",
			}}
		>
			<Box sx={{ display: "flex", gap: "0rem", flexDirection: "column" }}>
				<h3 style={{ margin: "0px", display: "inline" }}>{attributeName}</h3>
				<small style={{ color: "gray" }}>{attributeDescription}</small>
			</Box>{" "}
			{inputComponents}
			<hr style={{ width: "100%" }} />
		</Box>
	);
};

/* export default AttributeBlock; */
function areEqual(prev, next) {
	return prev.renderKey == next.renderKey;
}
export default memo(AttributeBlock, areEqual);
