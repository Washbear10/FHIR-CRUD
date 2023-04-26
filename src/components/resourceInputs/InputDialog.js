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

const InputDialog = ({
	open,
	handleClose,
	resource,
	resourceType,
	saveUpdates,
}) => {
	const [editedResource, setEditedResource] = useImmer(resource);
	const [originalResource, setOriginalResource] = useImmer(resource);
	const [backDropOpen, setBackDropOpen] = useState(false);
	const [inputDialogError, setinputDialogError] = useState(false);

	const theme = useTheme();

	const modifyResource = (field, value) => {
		//The following 2 conditionals are there because deceasedBoolean and deceasedDateTime have custom setters. TODO: figure out how to avoid those checks
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

	const getResourceInputDialog = (resource, resourceType, originalResource) => {
		if (!resource) return null;
		switch (resourceType) {
			case "Patient":
				return (
					<PatientInput resource={resource} modifyResource={modifyResource} />
				);
		}
	};

	/* 	const makePatchFormat = () => {
		let changedKeys = [];
		Object.keys(editedResource).forEach((key) => {
			if (editedResource[key] == originalResource[key]) {
				console.log("key value is same reference -> wasnt changed:");
			} else {
				console.log("key value is NOT same:");
				if (
					isObjectEmptyRecursive(editedResource[key]) &&
					!isObjectEmptyRecursive(originalResource[key])
				) {
					changedKeys.push({ op: "remove", path: `/${key}` });
				} else {
					let sp = JSON.parse(JSON.stringify(editedResource[key]));
					clearObjectFromEmptyValues(sp);

					changedKeys.push({
						op: "add",
						path: `/${key}`,
						value: sp,
					});
				}

			}
		});
		console.log(JSON.stringify(changedKeys));
		return JSON.stringify(changedKeys);
	}; */

	const handleSave = async () => {
		setBackDropOpen(true);
		let success = await saveUpdates(editedResource);
		/* let success = await saveUpdates(makePatchFormat()); */
		setBackDropOpen(false);
		if (success) handleClose();
		else setinputDialogError(true);
	};

	return (
		/* 		<InputDialogErrorContext.Provider
			value={{ inputDialogError, setinputDialogError }}
		> */
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
			<Backdrop
				sx={{ color: "#fff", zIndex: 1 }}
				open={backDropOpen}
				//onClick={handleCloseBackDrop}
			>
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
				{/* <Button color="success" variant="contained" onClick={makePatchFormat}>
					check patch
				</Button> */}
			</DialogActions>
		</Dialog>
		/* 		</InputDialogErrorContext.Provider> */
	);
};

export default InputDialog;
