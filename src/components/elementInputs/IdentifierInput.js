import React, { memo, useContext, useRef, useState } from "react";
import CodeInput from "../primitiveInputs/CodeInput";
import SmallTextField from "../styledComponents/SmallTextField";
import { Box } from "@mui/system";
import DateTabs from "../common/DateTabs";
import { useEffect } from "react";
import { Button, Stack } from "@mui/material";
import { Identifier } from "../../classes/dataTypes/Identifier";
import dayjs from "dayjs";
import { Typography } from "@mui/material";

import { Grid } from "@mui/material";
import CodeableConcept from "../../classes/dataTypes/CodeableConcept";
import CodeableConeptInput from "./CodeableConeptInput";
import Subcomponent from "../common/Subcomponent";
import Period from "../../classes/dataTypes/Period";
import PeriodInput from "../primitiveInputs/PeriodInput";
import { AttributeBlockWarningContext } from "../../utilities/Contexts";
import { isObjectEmptyRecursive } from "../../utilities/fhirify";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const validCodes = ["usual", "official", "temp", "secondary", "old"];
const IdentifierInput = ({ identifier, changeIdentifier }) => {
	const [errorMessage, setErrorMessage] = useState("");
	/* const {
		attributeBlockWarning,
		setAttributeBlockWarning,
		attributeBlockWarningMessage,
		setAttributeBlockWarningMessage,
	} = useContext(AttributeBlockWarningContext); */
	const wasMounted = useRef(false);
	useEffect(() => {
		if (wasMounted) checkInputValidity();
		else wasMounted.current = true;
	}, [identifier]);

	const checkInputValidity = () => {
		console.log("checking valdity for ident: ", identifier);
		if (
			(!identifier.value || identifier.value == "") &&
			!isObjectEmptyRecursive(identifier)
		) {
			setErrorMessage(
				"Warning: Identifier with no value has limited utility. If communicating that an identifier value has been suppressed or missing, the value element SHOULD be present with an extension indicating the missing semantic - e.g. data-absent-reason."
			);
		} else {
			setErrorMessage("");
		}
	};

	const handleChangeSystem = (e) => {
		let newIdentifier = new Identifier({
			...identifier,
			system: e.target.value == "" ? null : e.target.value,
		});
		changeIdentifier(newIdentifier, identifier);
	};
	const handleChangeValue = (e) => {
		let newIdentifier = new Identifier({
			...identifier,
			value: e.target.value == "" ? null : e.target.value,
		});
		changeIdentifier(newIdentifier, identifier);
	};
	const handleChangeUse = (value) => {
		let newIdentifier = new Identifier({
			...identifier,
			use: value == "" ? null : value,
		});
		changeIdentifier(newIdentifier, identifier);
	};

	const handleChangeCodeableConcept = (newCodeableConcept) => {
		let newIdentifier = new Identifier({
			...identifier,
			type: newCodeableConcept,
		});
		changeIdentifier(newIdentifier, identifier);
	};

	const handleChangePeriod = (newValue) => {
		let newIdentifier = new Identifier({
			...identifier,
			period: newValue,
		});
		changeIdentifier(newIdentifier, identifier);
	};

	return (
		<>
			<Box>
				{errorMessage ? (
					<Box sx={{ display: "flex", maxWidth: "100%", height: "20%" }}>
						<ErrorOutlineIcon
							color="warning"
							sx={{ marginLeft: "1rem", marginBottom: "-5px" }}
						/>
						<Typography color="warning.main" sx={{ marginLeft: "1rem" }}>
							{errorMessage}
						</Typography>
					</Box>
				) : null}
			</Box>
			<Grid
				container
				columnSpacing="10px"
				justifyContent={"space-between"}
				sx={{
					//backgroundColor: "rgba(255, 252, 234, 0.8)",
					padding: "10px 5px",
					maxWidth: "100%",
				}}
			>
				<Grid
					item
					xs={6}
					sx={{
						display: "flex",
						flexDirection: "row",
						alignItems: "end",
					}}
				>
					<Stack spacing={2} sx={{ maxWidth: "100%" }}>
						{" "}
						<Box
							sx={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "end",
								gap: "5px",
							}}
						>
							<CodeInput
								values={validCodes}
								label="use"
								v={identifier.use || ""}
								changeInput={handleChangeUse}
								width="20%"
							/>
							<SmallTextField
								label="system"
								value={identifier.system || ""}
								onChange={handleChangeSystem}
								width="40%"
							/>
							<SmallTextField
								label="value"
								value={identifier.value || ""}
								onChange={handleChangeValue}
								width="40%"
							/>
						</Box>
						<Subcomponent
							title="Type"
							description="(Description of identifier)"
						>
							<CodeableConeptInput
								codeableConcept={identifier.type}
								changeCodeableConcept={handleChangeCodeableConcept}
							/>
						</Subcomponent>
					</Stack>
				</Grid>
				<Grid
					item
					xs={6}
					sx={{
						alignItems: "start",
					}}
				>
					<Subcomponent
						title="Period"
						description="(From when to when this identifier was/is valid)"
					>
						<PeriodInput
							period={identifier.period}
							changePeriod={handleChangePeriod}
						/>
					</Subcomponent>
				</Grid>
			</Grid>
		</>
	);
};

export default IdentifierInput;

/* function areEqual(prev, next) {
	return prev.identifier == next.identifier;
}
export default memo(IdentifierInput, areEqual); */
