import React, { memo, useRef } from "react";
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
const validCodes = ["usual", "official", "temp", "secondary", "old"];
const IdentifierInput = ({ identifier, changeIdentifier }) => {
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
