import { v4 as uuidv4 } from "uuid";
import Period from "../../classes/dataTypes/Period";
export class ContactPoint {
	constructor({ system, value, use, rank, period, internalReactID }) {
		this.system = system;
		this.value = value;
		this.use = use;
		this.rank = rank;
		this.period = new Period({ ...period });
		this.internalReactID = internalReactID ? internalReactID : uuidv4();
	}

	calcDisplayString = () => {
		let s = "";
		if (this.value) s += this.value;
		return s;
	};
}
