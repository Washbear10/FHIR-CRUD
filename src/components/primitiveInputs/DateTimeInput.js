import React, { memo } from "react";
import { TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { dateToFHIRString } from "../../utilities/parseDateTime";
import { Box } from "@mui/system";
import { IconButton } from "@mui/material";
import SmallTextField from "../styledComponents/SmallTextField";
import { useRef } from "react";
import { Button } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
var objectSupport = require("dayjs/plugin/objectSupport");
dayjs.extend(objectSupport);
dayjs.locale("de");
const DateTimeInput = ({
	dateTimeString,
	typeOfDate,
	label,
	changeDateTime,
	disableFuture,
	disabled,
	error,
	errorMessage,
}) => {
	const [currentValue, setCurrentValue] = useState(
		dateTimeString ? dayjs(String(dateTimeString)) : undefined
	);
	const [dateTimeOpen, setDateTimeOpen] = useState(false);
	const [dateOpen, setDateOpen] = useState(false);

	useEffect(() => {
		if (!dateTimeString) {
			setCurrentValue(undefined);
		} else {
			setCurrentValue(dayjs(String(dateTimeString)));
		}
		return () => {};
	}, [dateTimeString]);

	const dateTimeAnchorEl = useRef(null);
	const dateAnchorEl = useRef(null);

	const handleClear = () => {
		changeDateTime(undefined, []);
		setDateOpen(false);
		setDateTimeOpen(false);
	};

	const CustomActionBar = ({ onClick }) => {
		return (
			<Box sx={{ justifyContent: "end", display: "flex" }}>
				<Button
					startIcon={<ClearIcon />}
					variant="outlined"
					color="error"
					onClick={onClick}
				>
					Clear date
				</Button>
			</Box>
		);
	};

	switch (typeOfDate) {
		case "date":
			return (
				<Box
					sx={{
						px: "3px",
						py: "2px",
						display: "flex",
						width: "100%",
					}}
					ref={dateAnchorEl}
				>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DatePicker
							value={currentValue}
							minDate={dayjs().subtract(1000, "year")}
							label={label}
							onChange={(newValue) => {
								setCurrentValue(newValue);
								changeDateTime(newValue, ["year", "month", "day"]);
							}}
							open={dateOpen}
							onClose={() => {
								setDateOpen(false);
							}}
							disableFuture={disableFuture}
							renderInput={(params) => {
								const { inputRef, inputProps, InputProps, ...other } = params;
								return (
									<SmallTextField
										{...inputProps}
										{...other}
										value={
											currentValue
												? dayjs(currentValue).format("DD.MM.YYYY")
												: ""
										}
										InputProps={{
											...InputProps,
											readOnly: true,
											startAdornment: (
												<IconButton
													size="small"
													onClick={() => {
														setDateOpen(true);
													}}
												>
													<CalendarMonthIcon fontSize="small" />
												</IconButton>
											),
										}}
										width="100%"
										error={error}
										helperText={errorMessage}
									/>
								);
							}}
							PopperProps={{
								anchorEl: dateAnchorEl.current,
							}}
							InputAdornmentProps={{
								position: "start",
							}}
							disabled={disabled}
							inputFormat="DD.MM.YYYY"
							views={["year", "month", "day"]}
						/>
					</LocalizationProvider>{" "}
				</Box>
			);
		case "dateTime":
			return (
				<Box
					sx={{
						display: "flex",
						px: "3px",
						py: "2px",
						width: "100%",
					}}
					ref={dateTimeAnchorEl}
				>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DateTimePicker
							components={{
								ActionBar: () => <CustomActionBar onClick={handleClear} />,
							}}
							value={currentValue}
							minDate={dayjs().subtract(1000, "year")}
							label={label}
							onChange={(newValue) => {
								setCurrentValue(newValue);
								changeDateTime(newValue, ["year", "month", "day", "time"]);
							}}
							open={dateTimeOpen}
							onClose={() => {
								setDateTimeOpen(false);
							}}
							PopperProps={{
								anchorEl: dateTimeAnchorEl.current,
							}}
							disableFuture={disableFuture}
							renderInput={(params) => {
								const { inputRef, inputProps, InputProps, ...other } = params;
								return (
									<SmallTextField
										{...inputProps}
										{...other}
										value={
											currentValue
												? dayjs(currentValue).format("DD.MM.YYYY HH:mm:ss")
												: ""
										}
										InputProps={{
											...InputProps,
											readOnly: true,
											startAdornment: (
												<IconButton
													size="small"
													onClick={() => {
														setDateTimeOpen(true);
													}}
												>
													<CalendarMonthIcon fontSize="small" />
												</IconButton>
											),
										}}
										width="100%"
										error={error}
										helperText={errorMessage}
									/>
								);
							}}
							InputAdornmentProps={{ position: "start" }}
							disabled={disabled}
							ampm={false}
							inputFormat="DD.MM.YYYY hh:mm"
							views={["year", "month", "day", "hours", "minutes", "seconds"]}
							openTo="year"
						/>
					</LocalizationProvider>
				</Box>
			);
	}
};

export default DateTimeInput;

/* function areEqual(prev, next) {
	return prev.dateTimeString == next.dateTimeString;
}
export default memo(DateTimeInput, areEqual); */
