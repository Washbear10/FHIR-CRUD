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

	calcDisplayString = () => {
		let s = "";
		this.prefix.forEach((pf) => {
			s += pf + " ";
		});
		if (this.family) s += this.family;
		if (this.given) if (this.family) s += ", ";
		s += this.given.reduce((acc, curr) => acc + " " + curr, "");
		return s;
	};
}
