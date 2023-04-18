import Coding from "./Coding";
import { v4 as uuidv4 } from "uuid";

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
}
