import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { IconButton, Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const ExtendableComponent = ({ title, handleExtend, children, ...rest }) => {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					width: "100%",
					rowGap: Object.keys(rest).includes("gap") ? rest.gap : "1.5rem",
				}}
			>
				{children}
			</Box>
			<Tooltip title={title}>
				<span style={{ width: "fit-content" }}>
					<IconButton
						variant="outlined"
						color="primary"
						sx={{ marginY: "5px", width: "fit-content" }}
						size="medium"
						onClick={() => {
							handleExtend();
						}}
						{...rest}
					>
						<AddCircleOutlineIcon fontSize="medium" />
					</IconButton>
				</span>
			</Tooltip>
		</Box>
	);
};

export default ExtendableComponent;
