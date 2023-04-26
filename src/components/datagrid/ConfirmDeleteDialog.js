import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import React from "react";

const ConfirmDeleteDialog = ({ open, confirm, cancel }) => {
	return (
		<Dialog open={open}>
			<DialogTitle
				sx={{
					backgroundColor: " #13121fff ",
					backgroundSize: "9px 9px",
					paddingRight: "1rem",
					color: "#cedeffff",
				}}
			>
				Delete selected resources?
			</DialogTitle>
			<DialogActions
				sx={{
					backgroundImage: "radial-gradient(#0000001e 1px, #b4c4f31a 0.45px)",
					backgroundSize: "9px 9px",
					justifyContent: "center",
				}}
			>
				<Button
					color="secondary"
					variant="outlined"
					onClick={() => {
						cancel();
					}}
				>
					Cancel
				</Button>
				<Button
					color="primary"
					variant="contained"
					onClick={() => {
						confirm();
					}}
				>
					Confirm
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ConfirmDeleteDialog;
