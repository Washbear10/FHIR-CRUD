import dayjs from "dayjs";

export function getDateTimeParts(value) {
	if (!value || !dayjs(value).isValid()) return Array(10).fill(null);
	const dateTimeString = String(value);
	let [datePart, timeOffsetPart] = ["", ""];
	if (dateTimeString.includes("T")) {
		[datePart, timeOffsetPart] = dateTimeString.split("T");
	} else {
		datePart = dateTimeString;
	}

	const dateParts = datePart.split("-");
	const year = dateParts[0] || null;
	const month = dateParts[1] || null;
	const day = dateParts[2] || null;
	let hour = null;
	let minute = null;
	let second = null;
	let millisecond = null;
	let plusMinus = null;
	let timezoneOffsetHour = null;
	let timezoneOffsetMinute = null;
	if (timeOffsetPart) {
		const timeOffsetParts = timeOffsetPart.split(/[Z+-]/);
		const timeParts = timeOffsetParts[0].split(":");
		hour = timeParts[0] || null;
		minute = timeParts[1] || null;
		let secondAndMillisecondPart = timeParts[2]
			? timeParts[2].split(".")
			: [null, null];
		second = secondAndMillisecondPart[0] || null;
		millisecond = secondAndMillisecondPart[1] || null;

		if (timeOffsetParts.length > 1) {
			//either + or - was found, or Z
			if (timeOffsetParts[1]) {
				// it was not split to '' -> actual hour and minute found (form: hh:mm)
				timezoneOffsetHour = timeOffsetParts[1].substring(0, 2) || null;
				timezoneOffsetMinute = timeOffsetParts[1].substring(3) || null;
				// this is the position of the + or -
				if (dateTimeString.charAt(dateTimeString.length - 6) === "+") {
					plusMinus = "+";
				} else if (dateTimeString.charAt(dateTimeString.length - 6) === "-") {
					plusMinus = "-";
				} else {
					alert("Whoops, parsing datetimestring parts went wrong");
				}
			} else {
				// else : Z found -> split to '' -> standard +00:00 UTC offset implied
				timezoneOffsetHour = "00";
				timezoneOffsetMinute = "00";
			}
		}
	}

	return [
		year,
		month,
		day,
		hour,
		minute,
		second,
		millisecond,
		plusMinus,
		timezoneOffsetHour,
		timezoneOffsetMinute,
	];
}

export function dateToFHIRString(date, parts) {
	if (date == null) return "";

	let s2 = "";
	if (parts.includes("year")) {
		s2 = date.format("YYYY");
		if (parts.includes("month")) {
			s2 = date.format("YYYY-MM");
			if (parts.includes("day")) {
				s2 = date.format("YYYY-MM-DD");
				if (parts.includes("time")) {
					s2 = date.format("YYYY-MM-DDTHH:mm:ssZ");
				}
			}
		}

		// Manually add leading 0s because dayjs is too dumb to do it
		if (date.year() < 10) s2 = "000" + s2;
		else if (date.year() < 100) s2 = "00" + s2;
		else if (date.year() < 1000) s2 = "0" + s2;
	}

	return s2;
}
