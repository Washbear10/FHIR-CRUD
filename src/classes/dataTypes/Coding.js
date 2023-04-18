import { v4 as uuidv4 } from "uuid";
export default class Coding {
	constructor({
		system,
		version,
		code,
		display,
		userSelected,
		internalReactID,
	}) {
		this.system = system;
		this.version = version;
		this.code = code;
		this.display = display;
		this.userSelected = userSelected;
		this.internalReactID = internalReactID ? internalReactID : uuidv4();
	}
}
