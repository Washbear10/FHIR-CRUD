import { Box } from "@mui/system";

export class PartialDateTime {
	constructor({ year, month, day, time }) {
		this.year = year;
		this.month = month;
		this.day = day;
		this.time = time;
	}

	#computeDisplay() {
		return <Box> </Box>;
	}
	getRenderComponent() {
		const display = this.#computeDisplay();
		return <Box>{display}</Box>;
	}

	asString() {
		var s = "";
		if (this.year) {
			s += this.year.toString();
			s = "0".repeat(4 - this.year.toString().length) + s;
			if (this.month) {
				s += "-" + this.month.toString();
				s = "0".repeat(2 - this.month.toString().length) + s;
				if (this.day) {
					s += "-" + this.day.toString();
					s = "0".repeat(2 - this.day.toString().length) + s;
				}
			}
		}
		return s;
	}

	toDayJs() {
		let d = new Date();
		d.setFullYear(
			parseInt(this.year),
			parseInt(this.month) || null,
			parseInt(this.day) || null
		);
		return d;
	}
}
