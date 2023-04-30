import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { memo, useState } from "react";
import {
	AttributeBlockErrorContext,
	AttributeBlockWarningContext,
} from "../../utilities/other/Contexts";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

/**
 * Display a Block for a single Resource attribute block (e.g. Patient.name)
 */
const AttributeBlock = ({
	attributeName,
	attributeDescription,
	attributeLink,
	inputComponents,
	renderKey,
}) => {
	// displaying Errors or Warnings on Blocklevel
	const [attributeBlockError, setAttributeBlockError] = useState(false);
	const [attributeBlockErrorMessage, setAttributeBlockErrorMessage] =
		useState("");
	const [attributeBlockWarning, setAttributeBlockWarning] = useState(false);
	const [attributeBlockWarningMessage, setAttributeBlockWarningMessage] =
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
			<AttributeBlockWarningContext.Provider
				value={{
					attributeBlockWarning,
					setAttributeBlockWarning,
					attributeBlockWarningMessage,
					setAttributeBlockWarningMessage,
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
						<Box sx={{ display: "flex" }}>
							<h3 style={{ margin: "0px", alignSelf: "center" }}>
								{attributeName}
							</h3>

							<IconButton
								variant="outlined"
								color="primary"
								sx={{
									width: "fit-content",
									alignSelf: "start",
								}}
								size="small"
								onClick={() => {
									window.open(attributeLink, "_blank").focus();
								}}
							>
								<HelpOutlineIcon fontSize="medium" />
							</IconButton>
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
							{attributeBlockWarning ? (
								<Box sx={{ display: "flex" }}>
									<ErrorOutlineIcon
										color="warning"
										sx={{ marginLeft: "1rem", marginBottom: "-5px" }}
									/>
									<Typography color="warning.main" sx={{ marginLeft: "1rem" }}>
										{attributeBlockWarningMessage}
									</Typography>
								</Box>
							) : null}
						</Box>
						<small style={{ color: "gray" }}>{attributeDescription}</small>
					</Box>{" "}
					{inputComponents /* here the actual content will be passed */}
					<hr style={{ width: "100%" }} />
				</Box>
			</AttributeBlockWarningContext.Provider>
		</AttributeBlockErrorContext.Provider>
	);
};

/* export default AttributeBlock; */
function areEqual(prev, next) {
	return prev.renderKey == next.renderKey;
}
export default memo(AttributeBlock, areEqual);
