import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { dialogList } from "../../utilities/helpConstructInstances";
import PatientInput from "./PatientInput";
import { useState } from "react";
import { useEffect } from "react";
import { useImmer } from "use-immer";
import dayjs from "dayjs";
import { Box } from "@mui/system";
import { Backdrop, CircularProgress, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import { json } from "react-router-dom";
import { clearObjectFromEmptyValues } from "../../utilities/fhirify";
import { Patient } from "../../classes/resourceTypes/Patient";

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
	/* useEffect(() => {
		alert("here");

		//I don't actually know why, but the condition causes two seperate valid Patient Objects to be created, whereas without the condition the first object created is null, which
		// will be received by the Patientinput which causes bugs in there because Patientinput expects a fully valid Patient Object.
		if (resource) {
			setEditedResource(resource);
		}
	}, [resource]); */
	/* useEffect(() => {
		console.acg("IPD received: ", resource);
	}, [resource]); */

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

	const makePatchFormat = () => {
		let changedKeys = [];
		Object.keys(editedResource).forEach((key) => {
			if (editedResource[key] == originalResource[key]) {
				console.log("key value is same reference -> wasnt changed:");
			} else {
				console.log("key value is NOT same:");
				let same = equal(editedResource[key], originalResource[key]);
				console.log(same);
				if (!same) changedKeys.push(key);
				/* let editedAttribute = JSON.parse(JSON.stringify(editedResource[key]));
				clearObjectFromEmptyValues(editedAttribute);
				let originalAttribute = JSON.parse(
					JSON.stringify(originalResource[key])
				);
				clearObjectFromEmptyValues(originalAttribute);
				console.log("o: ", originalAttribute);
				console.log("x: ", editedAttribute); 
				if (
					JSON.stringify(originalAttribute) == JSON.stringify(editedAttribute)
				) {
					console.log("but json string is same");
				} else {
					console.log("and json string is also not same");
					changedKeys.push(key);
				} */
			}
		});
		console.log(changedKeys);

		let patchedResource = new Patient({ ...editedResource });
		console.log(patchedResource);
		Object.keys(patchedResource).forEach((key) => {
			if (!changedKeys.includes(key) && key != "id")
				delete patchedResource[key];
		});

		console.log(patchedResource.toFHIRJson());
		return patchedResource;
	};

	const handleSave = async () => {
		setBackDropOpen(true);
		/* let success = await saveUpdates(editedResource); */
		let success = await saveUpdates(makePatchFormat());
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
				<Button color="success" variant="contained" onClick={makePatchFormat}>
					check patch
				</Button>
			</DialogActions>
		</Dialog>
		/* 		</InputDialogErrorContext.Provider> */
	);
};

export default InputDialog;
