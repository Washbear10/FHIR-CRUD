import React from "react";
import { Box } from "@mui/system";
import { Tooltip, IconButton } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const DeleteableComponent = ({ title, handleDelete, children, ...rest }) => {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
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