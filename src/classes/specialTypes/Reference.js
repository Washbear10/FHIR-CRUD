import { Identifier } from "../dataTypes/Identifier";
import { v4 as uuidv4 } from "uuid";

export default class Reference {
	constructor({ reference, type, identifier, display, internalReactID }) {
		this.reference = reference;
		this.type = type;
		this.identifier = identifier
			? new Identifier({ ...identifier })
			: new Identifier({});
		this.display = display;
		this.internalReactID = internalReactID ? internalReactID : uuidv4();
	}

	calcDisplayString = () => {
		let s1 = this.display
			? this.display
			: this.reference
			? this.reference.id
			: "";
	};
}
