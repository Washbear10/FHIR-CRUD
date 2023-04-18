import { v4 as uuidv4 } from "uuid";
export default class Period {
	constructor({ start, end, internalReactID }) {
		this.start = start;
		this.end = end;
		this.internalReactID = internalReactID ? internalReactID : uuidv4();
	}
}
