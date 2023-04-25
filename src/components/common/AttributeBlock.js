import React, { memo, useContext, useState } from "react";
import { Box } from "@mui/system";
import { useEffect } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Button, IconButton, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { AttributeBlockErrorContext } from "../../utilities/AttributeBlockErrorContext";
const AttributeBlock = ({
	attributeName,
	attributeDescription,
	inputComponents,
	renderKey,
}) => {
	const [attributeBlockError, setAttributeBlockError] = useState(false);

	const [attributeBlockErrorMessage, setAttributeBlockErrorMessage] =
		useState("");

	return (
		<AttributeBlockErrorContext.Provider
			value={{
				attributeBlockError,
				setAttributeBlockError,
				attributeBlockErrorMessage,
				setAttributeBlockErrorMessage,
			}}
		>
			<Box
				sx={{
					display: "flex",
					gap: "1rem",
					flexDirection: "column",
					paddingBottom: "1.5rem",
					paddingX: "1rem",
				}}
			>
				<Box
					sx={{
						display: "flex",
						gap: "0rem",
						flexDirection: "column",
					}}
				>
					<h3 style={{ margin: "0px", display: "flex" }}>
						{attributeName}
						{attributeBlockError ? (
							<Box sx={{ display: "flex" }}>
								<ErrorOutlineIcon
									color="error"
									sx={{ marginLeft: "1rem", marginBottom: "-5px" }}
								/>
								<Typography color="error" sx={{ marginLeft: "1rem" }}>
									{attributeBlockErrorMessage}
								</Typography>
							</Box>
						) : null}
					</h3>

					<small style={{ color: "gray" }}>{attributeDescription}</small>
				</Box>{" "}
				{inputComponents}
				<hr style={{ width: "100%" }} />
			</Box>
		</AttributeBlockErrorContext.Provider>
	);
};

/* export default AttributeBlock; */
function areEqual(prev, next) {
	return prev.renderKey == next.renderKey;
}
export default memo(AttributeBlock, areEqual);
