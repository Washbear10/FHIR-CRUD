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

/**
 * Display a Tab component for switching betwwen full date(-time) and partial date(-time) inputs
 * @param {*} value the fhir date/datetime string received
 * @param {*} typeOfDate date or datetime?
 * @param {*} changeDateTime callback to change the value
 * @param {*} label label for tabs, might not need anymore?
 * @param {*} disableFuture only past allowed?
 * @param {*} width fixed width of the whole component
 * @param {*} error display an error?
 * @returns
 */
const DateTabs = ({
	value,
	typeOfDate,
	changeDateTime,
	label,
	disableFuture,
	width,
	error,
}) => {
	/**
	 * Calculate which tab to select based on value given
	 * @param {*} value
	 * @returns
	 */
	const calculateCorrectTab = (value) => {
		if (!value || !dayjs(value).isValid()) return "one";
		let parts = getDateTimeParts(value);
		if (typeOfDate == "date") {
			if (parts[0] && parts[1] && parts[2]) {
				// -> all three values of date are present -> full date
				return "one";
			} else {
				return "two";
			}
		} else if (typeOfDate == "dateTime") {
			if (parts[0] && parts[1] && parts[2] && parts[3]) {
				// -> all four values of datetime are present -> full datetime
				return "one";
			} else {
				return "two";
			}
		} else return "one";
	};

	const [selectedTab, setSelectedTab] = useState(calculateCorrectTab(value));

	// which parts of the date or datetime are given in the string
	const [dateTimeParts, setDateTimeParts] = useState(getDateTimeParts(value));

	const [pickedDate, setPickedDate] = useState(
		value && dayjs(value).isValid() ? value : null
	);

	// if the string (value) received can be parsed to a valid date, set the pickedDate to that day.
	// Also take note which parts are actually provided (necessary since dayjs converts partial dates to full dates -> need to keep track of that information).
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
							let s = dateToFHIRString(newDate, parts); // convert dayjs object to fhir string containing the given parts
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
