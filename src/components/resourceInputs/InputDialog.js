import { useTheme } from "@emotion/react";
import { Backdrop, CircularProgress, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import * as React from "react";
import { useState } from "react";
import { useImmer } from "use-immer";
import PatientInput from "./PatientInput";

var equal = require("deep-equal");

/**
 * Component that renders an edit form with the actual contents being conditional of the resourceType
 * @param {*} resource The resource that was selected from the Datagrid
 * @param {*} resourceType Type of the resource to conditionally render correct content
 * @returns
 */
const InputDialog = ({
	open,
	handleClose,
	resource,
	resourceType,
	saveUpdates,
}) => {
	// resource state that will be modified
	const [editedResource, setEditedResource] = useImmer(resource);
	// keep copy of original
	const [originalResource, setOriginalResource] = useImmer(resource);

	// displaying loading or errors
	const [backDropOpen, setBackDropOpen] = useState(false);
	const [inputDialogError, setinputDialogError] = useState(false);

	const theme = useTheme();

	/**
	 * Callback being passed down to components that can use it to change the data of the resource
	 * @param {*} field The string name of the element of the resource to be modified
	 * @param {*} value The value to insert
	 */
	const modifyResource = (field, value) => {
		//The following 4 conditionals are there because deceasedBoolean and deceasedDateTime have custom setters. TODO: figure out how to avoid those checks
		if (field === "deceasedBoolean") {
			setEditedResource((draft) => {
				draft.setDeceasedBoolean(value);
			});
		} else if (field === "deceasedDateTime") {
			setEditedResource((draft) => {
				draft.setDeceasedDateTime(value);
			});
		} else if (field === "multipleBirthBoolean") {
			setEditedResource((draft) => {
				draft.setMultipleBirthBoolean(value);
			});
		} else if (field === "multipleBirthInteger") {
			setEditedResource((draft) => {
				draft.setMultipleBirthInteger(value);
			});
		} else {
			setEditedResource((draft) => {
				draft[field] = value;
			});
		}
	};

	const getResourceInputDialog = (resource, resourceType) => {
		if (!resource) return null;
		switch (resourceType) {
			case "Patient":
				return (
					<PatientInput resource={resource} modifyResource={modifyResource} />
				);
		}
	};

	/**
	 * Save modifications to Server
	 */
	const handleSave = async () => {
		setBackDropOpen(true);
		let success = await saveUpdates(editedResource);
		/* let success = await saveUpdates(makePatchFormat()); */
		setBackDropOpen(false);
		if (success) handleClose();
		else setinputDialogError(true);
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
			<DialogTitle
				sx={{
					backgroundColor: " #13121fff ",
					backgroundSize: "9px 9px",
					paddingRight: "1rem",
					color: "#cedeffff",
					borderTop: !inputDialogError ? null : "2px solid red",
					borderLeft: !inputDialogError ? null : "2px solid red",
					borderRight: !inputDialogError ? null : "2px solid red",
				}}
			>
				{resourceType}
			</DialogTitle>
			<Backdrop sx={{ color: "#fff", zIndex: 1 }} open={backDropOpen}>
				<CircularProgress color="inherit" />
			</Backdrop>
			<DialogContent
				sx={{
					backgroundImage: "radial-gradient(#0000001e 1px, #b4c4f31a 0.45px)",
					backgroundSize: "9px 9px",
					borderLeft: !inputDialogError ? null : "2px solid red",
					borderRight: !inputDialogError ? null : "2px solid red",
				}}
			>
				{getResourceInputDialog(editedResource, resourceType, originalResource)}
			</DialogContent>
			<DialogActions
				sx={{
					backgroundImage: "radial-gradient(#0000001e 1px, #b4c4f31a 0.45px)",
					backgroundSize: "9px 9px",
					paddingRight: "1rem",
					borderBottom: !inputDialogError ? null : "2px solid red",
					borderLeft: !inputDialogError ? null : "2px solid red",
					borderRight: !inputDialogError ? null : "2px solid red",
				}}
			>
				{inputDialogError ? (
					<Typography sx={{ mx: "1rem", color: theme.palette.error.main }}>
						Check if all inputs are valid
					</Typography>
				) : null}
				<Button color="secondary" variant="contained" onClick={handleClose}>
					Close
				</Button>
				<Button color="success" variant="contained" onClick={handleSave}>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default InputDialog;
