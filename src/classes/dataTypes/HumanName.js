import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { TextField } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

import Period from "../../classes/dataTypes/Period";
export class HumanName {
	constructor({
		use,
		text,
		family,
		given,
		prefix,
		suffix,
		period,
		internalReactID,
	}) {
		this.use = use;
		this.text = text;
		this.family = family;
		this.given = given ? given : [""];
		this.prefix = prefix ? prefix : [""];
		this.suffix = suffix ? suffix : [""];
		this.period = new Period({ ...period });
		this.internalReactID = internalReactID ? internalReactID : uuidv4();
	}

	#computeDisplay() {
		var s = "";
		if (this.prefix) {
			var test = this.prefix.reduce((acc, curr) => acc + " " + curr, "");
			s = s + test + " ";
		}
		if (this.given) {
			var test = this.given.reduce((acc, curr) => acc + " " + curr, "");
			s = s + test + " ";
		}
		if (this.family) {
			s = s + this.family + " ";
		}
		if (this.suffix) {
			var test = this.suffix.reduce((acc, curr) => acc + " " + curr, "");
			s = s + test + " ";
		}

		s = s.trim();
		return s;
	}

	getRenderComponent() {
		const display = this.#computeDisplay();
		return <Box>{display}</Box>;
	}
}
