import CodeableConcept from "./CodeableConcept";

import { v4 as uuidv4 } from "uuid";

export default class Communication {
	constructor({ language, preferred, internalReactID }) {
		this.language = new CodeableConcept({ ...language });
		this.preferred = preferred;
		this.internalReactID = internalReactID ? internalReactID : uuidv4();
	}

	calcDisplayString = () => {
		let s1 = this.language.text || "";
		return s1;
	};
}
