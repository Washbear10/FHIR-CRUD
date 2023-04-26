import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { Box } from "@mui/system";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
	dateToFHIRString,
	getDateTimeParts,
} from "../../utilities/formatting/parseDateTime";
import DateTimeInput from "../primitiveInputs/DateTimeInput";
import PartialDateTimeInput from "../primitiveInputs/PartialDateTimeInput";

const DateTabs = ({
	value,
	typeOfDate,
	changeDateTime,
	label,
	disableFuture,
	width,
	error,
}) => {
	const calculateCorrectTab = (value) => {
		if (!value || !dayjs(value).isValid()) return "one";
		let parts = getDateTimeParts(value);
		if (typeOfDate == "date") {
			if (parts[0] && parts[1] && parts[2]) {
				return "one";
			} else {
				return "two";
			}
		} else if (typeOfDate == "dateTime") {
			if (parts[0] && parts[1] && parts[2] && parts[3]) {
				return "one";
			} else {
				return "two";
			}
		} else return "one";
	};
	const [selectedTab, setSelectedTab] = useState(calculateCorrectTab(value));
	const [dateTimeParts, setDateTimeParts] = useState(getDateTimeParts(value));

	//const [wasOriginalModified, setWasOriginalModified] = useState(false);
	const [pickedDate, setPickedDate] = useState(
		value && dayjs(value).isValid() ? value : null
	);

	useEffect(() => {
		if (!value) {
			setPickedDate(null);
			setDateTimeParts([]);
		} else {
			if (dayjs(value).isValid()) {
				setPickedDate(value);
				setSelectedTab(calculateCorrectTab(value));
				setDateTimeParts(getDateTimeParts(value));
			}
		}
		return () => {};
	}, [value]);
	/* useEffect(() => {
		console.log("HERE value  changed in datetabs props:");
		console.log(value);
	}, [value]); */

	return (
		<Box sx={{ mx: "2px", maxWidth: "100%", width: width || {} }}>
			<Tabs
				variant="fullWidth"
				value={selectedTab}
				onChange={(e, newTab) => {
					setSelectedTab(newTab);
				}}
				sx={{ mb: "0.5rem" }}
			>
				<Tab
					wrapped
					value="one"
					label={typeOfDate == "date" ? "Full date" : "Full datetime"}
				/>
				<Tab
					wrapped
					value="two"
					label={typeOfDate == "dateTime" ? "Partial datetime" : "Partial date"}
				/>
			</Tabs>
			<Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
				{selectedTab == "one" ? (
					<>
						<DateTimeInput
							dateTimeString={pickedDate}
							typeOfDate={typeOfDate}
							changeDateTime={(newDate, parts) => {
								console.log("newDate: ");
								console.log(newDate);
								let s = dateToFHIRString(newDate, parts);
								console.log("fhirestring: " + s);
								changeDateTime(s);
							}}
							label={label}
							disableFuture={disableFuture}
							error={error}
						/>
					</>
				) : (
					<PartialDateTimeInput
						typeOfDate={typeOfDate}
						partialDateTimeString={pickedDate}
						dateTimeParts={dateTimeParts}
						changeDateTime={(newDate, parts) => {
							console.log("newDate: ", newDate);
							console.log("parts: ", parts);
							let s = dateToFHIRString(newDate, parts);
							console.log("fhirestring: " + s);
							changeDateTime(s);
						}}
						error={error}
					/>
				)}
			</Box>
		</Box>
	);
};

export default DateTabs;
