import React from "react";
import { TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Button } from "@mui/material";

const Testpicker = ({}) => {
	require("dayjs/locale/de");
	//var localizedFormat = require("dayjs/plugin/localizedFormat");
	//dayjs.extend(localizedFormat);
	//dayjs().format("L LT");
	dayjs.locale("de");

	//const [x, setX] = useState(dayjs("2015-05-12T10:10:10+01:00"));
	const [x, setX] = useState(dayjs("2015-05-12"));
	return (
		<Box>
			<Button onClick={() => {}}>helo</Button>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<DateTimePicker
					value={x}
					renderInput={(params) => {
						return <TextField {...params} />;
					}}
					onChange={(e) => {}}
				/>
			</LocalizationProvider>
		</Box>
	);
};

export default Testpicker;
