import Reference from "../specialTypes/Reference";
import { v4 as uuidv4 } from "uuid";

export default class Link {
	constructor({ other, type, internalReactID }) {
		this.type = type;
		this.other = new Reference({ ...other });
		this.internalReactID = internalReactID ? internalReactID : uuidv4();
	}
}
