import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { IconButton, Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

/**
 * Wrapper to delete elements with cardinaility > 1
 * @param {*} title Tooltip displayed over delete button
 */
const DeleteableComponent = ({ title, handleDelete, children, ...rest }) => {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "row",
				alignItems: "center" /*  */,
			}}
		>
			<Tooltip title={title} sx={{}}>
				<span>
					<IconButton
						variant="outlined"
						color="error"
						sx={{
							width: "fit-content",
							alignSelf: "center",
						}}
						size="medium"
						onClick={() => {
							handleDelete();
						}}
						{...rest}
					>
						<RemoveCircleOutlineIcon fontSize="medium" />
					</IconButton>
				</span>
			</Tooltip>
			<Box sx={{ width: "100%" }}>{children}</Box>
		</Box>
	);
};

export default DeleteableComponent;
