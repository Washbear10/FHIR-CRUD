import { v4 as uuidv4 } from "uuid";
import Period from "../../classes/dataTypes/Period";

export default class Address {
	constructor({
		use,
		type,
		text,
		line,
		city,
		district,
		state,
		postalCode,
		country,
		period,
		internalReactID,
	}) {
		this.use = use;
		this.type = type;
		this.text = text;
		this.line = line ? line : [""];
		this.city = city;
		this.district = district;
		this.state = state;
		this.postalCode = postalCode;
		this.country = country;
		this.period = new Period({ ...period });
		this.internalReactID = internalReactID ? internalReactID : uuidv4();
	}

	calcDisplayString = () => {
		let s1 = "";
		if (this.line) s1 += this.line.reduce((acc, curr) => curr + "," + acc, "");
		s1 = s1.slice(0, s1.length - 1);
		let s2 = "";
		if (this.postalCode) s2 += this.postalCode;
		let s3 = "";
		if (this.state) s3 += this.state;
		let s4 = "";
		if (this.country) {
			s4 += this.country;
		}
		let joined = [s1, s2, s3, s4].filter((item) => item).join(", ");
		return joined;
	};
}
