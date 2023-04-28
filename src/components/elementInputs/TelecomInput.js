import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { ContactPoint } from "../../classes/dataTypes/ContactPoint";
import Subcomponent from "../common/Subcomponent";
import CodeInput from "../primitiveInputs/CodeInput";
import IntegerInput from "../primitiveInputs/IntegerInput";
import PeriodInput from "../primitiveInputs/PeriodInput";
import SmallTextField from "../styledComponents/SmallTextField";
import {
	contactPointSystem,
	contactPointUse,
} from "../../utilities/valueSets/valueSets";

const TelecomInput = ({ telecom, changeTelecom }) => {
	// Section for checking validity of inputs
	//
	const [errorMessage, setErrorMessage] = useState("");
	const wasMounted = useRef(false);
	useEffect(() => {
		if (!wasMounted) {
			wasMounted.current = true;
			return;
		}
		if (telecom.value && !telecom.system) {
			setErrorMessage("A system is required if a value is provided.");
		} else {
			setErrorMessage("");
		}
	}, [telecom]);

	// Section for handling data changes
	//
	const handleChangeSystem = (val) => {
		let newTelecom = new ContactPoint({ ...telecom, system: val });
		changeTelecom(newTelecom, telecom);
	};
	const handleChangeValue = (val) => {
		let newTelecom = new ContactPoint({ ...telecom, value: val });
		changeTelecom(newTelecom, telecom);
	};
	const handleChangeUse = (val) => {
		let newTelecom = new ContactPoint({ ...telecom, use: val });
		changeTelecom(newTelecom, telecom);
	};
	const handleChangeRank = (val) => {
		console.log("changerank received: ", val, "type: ", typeof val);
		let newTelecom;
		if (val == "") {
			newTelecom = new ContactPoint({
				...telecom,
				rank: null,
			});
		} else if (parseInt(val) < 2147483647) {
			// max constraint of positive Int type in FHIR
			newTelecom = new ContactPoint({
				...telecom,
				rank: parseInt(val),
			});
		} else {
			return;
		}
		changeTelecom(newTelecom, telecom);
	};

	const handleChangePeriod = (newValue) => {
		let newTelecom = new ContactPoint({
			...telecom,
			period: newValue,
		});
		changeTelecom(newTelecom, telecom);
	};

	// render section
	return (
		<>
			<Box>
				{errorMessage ? (
					<Box sx={{ display: "flex", maxWidth: "100%", height: "20%" }}>
						<ErrorOutlineIcon
							color="error"
							sx={{ marginLeft: "1rem", marginBottom: "-5px" }}
						/>
						<Typography color="error.main" sx={{ marginLeft: "1rem" }}>
							{errorMessage}
						</Typography>
					</Box>
				) : null}
			</Box>
			<Grid container columnSpacing={"10px"}>
				<Grid item xs={6}>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "start",
							justifyContent: "center",
							rowGap: "1rem",
							height: "100%",
						}}
					>
						<Box sx={{ display: "flex", columnGap: "0.5rem", width: "100%" }}>
							<CodeInput
								values={contactPointSystem}
								label="system"
								v={telecom.system || ""}
								changeInput={(value) => {
									handleChangeSystem(value);
								}}
							/>
							<SmallTextField
								label="value"
								value={telecom.value || ""}
								width="500px"
								onChange={(e) => {
									handleChangeValue(e.target.value);
								}}
							/>
						</Box>
						<Box sx={{ display: "flex", columnGap: "0.5rem", width: "100%" }}>
							<CodeInput
								values={contactPointUse}
								label="use"
								v={telecom.use || ""}
								changeInput={(value) => {
									handleChangeUse(value);
								}}
							/>
							<IntegerInput
								label="rank"
								value={Number.isInteger(telecom.rank) ? telecom.rank : ""}
								changeValue={(newValue) => {
									handleChangeRank(newValue);
								}}
								negativeAllowed={false}
								min={1}
								max={2147483647}
								/* InputProps={{
								endAdornment: (
									<InputAdornment position="end"><</InputAdornment>
								),
							}} */
								type="number"
							/>
						</Box>
					</Box>
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
						description="(From when to when this telecom was/is valid)"
					>
						{" "}
						<Box
							sx={{
								display: "flex",
								flexDirection: "row",
								columnGap: "10px",
								width: "100%",
							}}
						>
							<PeriodInput
								period={telecom.period}
								changePeriod={handleChangePeriod}
							/>
						</Box>
					</Subcomponent>
				</Grid>
			</Grid>
		</>
	);
};

/* export default memo(TelecomInput); */

export default TelecomInput;

/* function areEqual(prev, next) {
	console.log(prev.telecom == next.telecom);
	return prev.telecom == next.telecom;
}
export default memo(TelecomInput, areEqual); */
