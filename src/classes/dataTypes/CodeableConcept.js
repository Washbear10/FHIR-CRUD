import { v4 as uuidv4 } from "uuid";
import Coding from "./Coding";

export default class CodeableConcept {
	constructor({ coding, text, internalReactID }) {
		this.coding = coding
			? coding.map((singleCoding) => {
					let c = new Coding({ ...singleCoding });
					if (singleCoding.internalReactID)
						c.internalReactID = singleCoding.internalReactID;
					return c;
			  })
			: [new Coding({})];
		this.text = text;
		this.internalReactID = internalReactID ? internalReactID : uuidv4();
	}

	calcDisplayString = () => {
		let s1 = this.text || "";
		return s1;
	};
}
