import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import Period from "../../classes/dataTypes/Period";
import DateTabs from "../common/DateTabs";

const PeriodInput = ({ period, changePeriod, ...rest }) => {
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		let validationMessage = validatePeriod(period);
		if (validationMessage) {
			setError(true);
			setErrorMessage(validationMessage);
		} else {
			setError(false);
			setErrorMessage("");
		}
	}, [period]);

	const validatePeriod = (p) => {
		// check if start before end date and return an errormessage if not
		let differenceError =
			"Error: the start should not be a later date than the end";
		if (!p.start || !p.end) return "";
		let s = dayjs(p.start);
		let e = dayjs(p.end);
		if (e.isBefore(s)) {
			return differenceError;
		}
		return "";
	};

	let handleChangePeriodEnd = (newValue) => {
		if (dayjs(newValue).isValid()) {
			let newPeriod = new Period({
				...period,
				end: newValue,
			});
			changePeriod(newPeriod);
		} else if (newValue === "") {
			let newPeriod = new Period({
				...period,
				end: null,
			});
			changePeriod(newPeriod);
		} else {
			alert("Something went wrong changing the date.");
		}
	};

	let handleChangePeriodStart = (newValue) => {
		if (dayjs(newValue).isValid()) {
			let newPeriod = new Period({
				...period,
				start: newValue,
			});
			changePeriod(newPeriod);
		} else if (newValue === "") {
			let newPeriod = new Period({
				...period,
				start: null,
			});
			changePeriod(newPeriod);
		} else {
			alert("Something went wrong changing the date.");
		}
	};

	// render section
	return (
		<>
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					columnGap: "10px",
					width: "100%",
				}}
			>
				<Box
					sx={{
						width: "100%",
					}}
				>
					<span
						style={{
							color: "gray",
							alignSelf: "end",
							marginBottom: "1rem",
						}}
					>
						start:
					</span>
					<DateTabs
						label="Start"
						typeOfDate="dateTime"
						value={period.start}
						changeDateTime={handleChangePeriodStart}
						width={Object.keys(rest).includes("maxWidth") ? rest.maxWidth : ""}
						error={error}
					/>
				</Box>
				<Box
					sx={{
						width: "100%",
					}}
				>
					<span
						style={{
							color: "gray",
							alignSelf: "end",
							marginBottom: "1rem",
						}}
					>
						end:
					</span>

					<DateTabs
						label="End"
						typeOfDate="dateTime"
						value={period.end}
						changeDateTime={handleChangePeriodEnd}
						width={Object.keys(rest).includes("maxWidth") ? rest.maxWidth : ""}
						error={error}
					/>
				</Box>
			</Box>
			<Typography
				variant="subtitle2"
				color="error"
				sx={{ alignSelf: "center", py: "2px" }}
			>
				<i>{errorMessage}</i>
			</Typography>
		</>
	);
};

export default PeriodInput;
