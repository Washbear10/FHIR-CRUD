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
		if (this.text) {
			return this.text;
		}
		let s1 = "";
		this.prefix.forEach((pf) => {
			s1 += pf + " ";
		});
		if (this.family) s1 += this.family;
		s1 = s1.trim();
		let s3 = "";
		if (this.given)
			s3 += this.given.reduce((acc, curr) => acc + " " + curr, "");
		s3 = s3.trim();
		let final = [s1, s3].filter((item) => item).join(", ");
		return final;
	};
}
