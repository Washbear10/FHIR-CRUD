import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { DialogTitle, IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import { CalendarPicker, MonthPicker, YearPicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import * as React from "react";
import { useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import { Dialog } from "@mui/material";
import * as colors from "@mui/material/colors";
import { useEffect } from "react";
import { NumberStyleTextfield } from "../styledComponents/NumberStyleTextfield";

var objectSupport = require("dayjs/plugin/objectSupport");
dayjs.extend(objectSupport);

const yearGeneral = /^\d{0,4}$/;
const yearExact = /^\d{4}$/;

const dayGeneral = /(^[1-9]$)|^(0[1-9]|1[0-9]|2[0-9]|3[01])$/;

const monthGeneral = /^[012]{0,1}$/;
const monthExact = /(^[1-9]$)|^(0[1-9]|1[012])$/;
const PartialDateTimeInput = ({
	typeOfDate,
	partialDateTimeString,
	dateTimeParts,
	changeDateTime,
	disableFuture,
	disabled,
	error,
}) => {
	const [openYear, setOpenYear] = useState(false);
	const [openMonth, setOpenMonth] = useState(false);
	const [openDay, setOpenDay] = useState(false);

	const [y, setY] = useState(dateTimeParts.at(0) || "");
	const [m, setM] = useState(dateTimeParts.at(1) || "");
	const [d, setD] = useState(dateTimeParts.at(2) || "");
	const [currentValue, setCurrentValue] = useState(
		partialDateTimeString ? dayjs(partialDateTimeString) : null
	);

	useEffect(() => {
		if (!partialDateTimeString) {
			setCurrentValue(undefined);
			setY("");
			setM("");
			setD("");
		}
	}, [partialDateTimeString]);

	const helpSetYear = (value) => {
		setY(value);
		if (currentValue) {
			var pdt = currentValue.clone();
			pdt = pdt.set("year", parseInt(value));
			setCurrentValue(pdt);
		} else {
			var pdt = dayjs().year(parseInt(value));
			setCurrentValue(pdt);
		}
		changeDateTime(
			pdt,
			value
				? m
					? d
						? ["year", "month", "day"]
						: ["year", "month"]
					: ["year"]
				: []
		);
	};

	const helpSetMonth = (value) => {
		if (typeof value == "number") {
			// then value was received fom calendar picking
			setM(String(value).padStart(2, "0"));
		} else if (typeof value == "string") {
			// then value was received by typing
			setM(value);
		}
		if (currentValue) {
			var pdt = currentValue.clone();
			pdt = pdt.set("month", parseInt(value) - 1);
			setCurrentValue(pdt);
		} else {
			var pdt = dayjs({ month: parseInt(value) - 1 });
			setCurrentValue(pdt);
		}
		changeDateTime(
			pdt,
			y
				? value
					? d
						? ["year", "month", "day"]
						: ["year", "month"]
					: ["year"]
				: []
		);
	};

	const helpSetDay = (value) => {
		if (typeof value == "number") {
			// then value was received fom calendar picking
			setD(String(value).padStart(2, "0"));
		} else if (typeof value == "string") {
			// then value was received by typing
			setD(value);
		}
		if (currentValue) {
			var pdt = currentValue.clone();
			pdt = pdt.set("date", parseInt(value));
			setCurrentValue(pdt);
		} else {
			var pdt = dayjs({ date: parseInt(value) });
			setCurrentValue(pdt);
		}

		changeDateTime(pdt, y ? (m ? ["year", "month", "day"] : ["year"]) : []);
	};

	const handleYearChange = (e) => {
		if (e.target.value == "") {
			setY("");
			setCurrentValue(null);
			if (currentValue) {
				changeDateTime(null, []);
			} else {
				alert("whoops");
			}
		} else if (e.target.value.match(yearGeneral)) {
			helpSetYear(e.target.value);
		}
	};
	const handleMonthChange = (e) => {
		if (e.target.value == "" || e.target.value == "0") {
			setM(e.target.value);
			if (currentValue) {
				changeDateTime(currentValue, y ? ["year"] : []);
			} else {
				alert("whoops");
			}
		} else if (e.target.value.match(monthExact)) {
			helpSetMonth(e.target.value);
		}
	};
	const handleDayChange = (e) => {
		if (e.target.value == "" || e.target.value == "0") {
			setD(e.target.value);
			if (currentValue) {
				changeDateTime(
					currentValue,
					y ? (m ? ["year", "month"] : ["year"]) : []
				);
			} else {
				alert("whoops");
			}
		} else if (e.target.value.match(dayGeneral)) {
			helpSetDay(e.target.value);
		}
	};

	const hideIcons = () => {
		return null;
	};

	return (
		<Box sx={{ display: "flex", py: "2px" }}>
			<NumberStyleTextfield
				sx={{
					svg: { color: colors.indigo[900] },
				}}
				label="year"
				InputProps={{
					startAdornment: (
						<IconButton
							size="small"
							disabled={false}
							onClick={() => {
								setOpenYear(true);
							}}
						>
							<CalendarMonthIcon fontSize="small" />
						</IconButton>
					),
				}}
				onChange={(e) => {
					handleYearChange(e);
				}}
				value={y}
				placeholder="yyyy"
				error={error}
			/>
			<Dialog open={openYear}>
				<DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
					Pick a year
					<IconButton
						onClick={() => {
							setOpenYear(false);
						}}
					>
						<CloseIcon color="error" />
					</IconButton>
				</DialogTitle>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<YearPicker
						onChange={(e) => {
							helpSetYear(e.year());
							setOpenYear(false);
						}}
					/>
				</LocalizationProvider>
			</Dialog>

			<NumberStyleTextfield
				sx={{
					svg:
						!currentValue || !y
							? { color: colors.indigo[100] }
							: { color: colors.indigo[900] },
				}}
				label="month"
				disabled={!currentValue || !y}
				InputProps={{
					startAdornment: (
						<IconButton
							size="small"
							disabled={!currentValue || !y}
							onClick={() => {
								setOpenMonth(true);
							}}
						>
							<CalendarMonthIcon fontSize="small" />
						</IconButton>
					),
				}}
				placeholder="mm"
				onChange={(e) => {
					handleMonthChange(e);
				}}
				type="number"
				value={m}
				error={error}
			/>

			<Dialog open={openMonth}>
				<DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
					Pick a month
					<IconButton
						onClick={() => {
							setOpenMonth(false);
						}}
					>
						<CloseIcon color="error" />
					</IconButton>
				</DialogTitle>{" "}
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<MonthPicker
						onChange={(e) => {
							helpSetMonth(e.month() + 1);
							setOpenMonth(false);
						}}
					/>
				</LocalizationProvider>
			</Dialog>
			{typeOfDate == "dateTime" ? (
				<>
					<NumberStyleTextfield
						sx={{
							svg:
								!currentValue || !y || !m
									? { color: colors.indigo[100] }
									: { color: colors.indigo[900] },
						}}
						label="Day"
						disabled={!currentValue || !y || !m}
						InputProps={{
							startAdornment: (
								<IconButton
									size="small"
									disabled={!currentValue || !y || !m}
									onClick={() => {
										setOpenDay(true);
									}}
								>
									<CalendarMonthIcon fontSize="small" />
								</IconButton>
							),
						}}
						placeholder="dd"
						onChange={(e) => {
							handleDayChange(e);
						}}
						type="number"
						value={d}
						error={error}
					/>
					<Dialog open={openDay}>
						<DialogTitle
							sx={{ display: "flex", justifyContent: "space-between" }}
						>
							Pick a date
							<IconButton
								onClick={() => {
									setOpenDay(false);
								}}
							>
								<CloseIcon color="error" />
							</IconButton>
						</DialogTitle>{" "}
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<CalendarPicker
								defaultCalendarMonth={currentValue}
								view="day"
								views={["day"]}
								onChange={(e) => {
									helpSetDay(e.date());
									setOpenDay(false);
								}}
								components={{
									LeftArrowIcon: hideIcons,
									RightArrowIcon: hideIcons,
									RightArrowButton: hideIcons,
									LeftArrowButton: hideIcons,
									SwitchViewButton: hideIcons,
								}}
							/>
						</LocalizationProvider>
					</Dialog>
				</>
			) : null}
		</Box>
	);
};

/* function areEqual(prev, next) {
	return prev.partialDateTimeString == next.partialDateTimeString;
}
export default memo(PartialDateTimeInput, areEqual); */

export default PartialDateTimeInput;
