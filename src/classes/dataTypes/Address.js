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
}
