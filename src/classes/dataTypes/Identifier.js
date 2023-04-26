import { v4 as uuidv4 } from "uuid";
import Period from "../../classes/dataTypes/Period";
import CodeableConcept from "./CodeableConcept";

export class Identifier {
	constructor({ use, type, system, value, period, assigner, internalReactID }) {
		this.use = use;
		this.type = new CodeableConcept({ ...type });
		this.system = system;
		this.value = value;
		this.period = new Period({ ...period });
		this.assigner = assigner;
		this.internalReactID = internalReactID ? internalReactID : uuidv4();
	}

	calcDisplayString = () => {
		let s = "";
		if (this.system) s += this.system + ": ";
		if (this.value) s += this.value;
		return s;
	};
}
