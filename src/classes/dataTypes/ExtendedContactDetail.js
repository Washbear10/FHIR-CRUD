import { v4 as uuidv4 } from "uuid";
import Period from "../../classes/dataTypes/Period";
import CodeableConcept from "./CodeableConcept";
import { HumanName } from "./HumanName";
import { ContactPoint } from "./ContactPoint";
import Address from "./Address";
import Reference from "../specialTypes/Reference";
export class ExtendedContactDetail {
	constructor({
		purpose,
		name,
		telecom,
		address,
		organization,
		period,
		internalReactID,
	}) {
		this.purpose = new CodeableConcept({ ...purpose });
		this.name = name
			? name.map((singleName) => new HumanName({ ...singleName }))
			: [new HumanName({})];
		this.telecom = telecom
			? telecom.map((singleTelecom) => new ContactPoint({ ...singleTelecom }))
			: [new ContactPoint({})];
		this.address = new Address({ ...address });
		this.organization = new Reference({ ...organization });
		this.period = new Period({ ...period });
		this.internalReactID = internalReactID ? internalReactID : uuidv4();
	}

	calcDisplayString = () => {
		let s = "";
		if (this.telecom && this.telecom[0].value) s += this.telecom[0].value;
		return s;
	};
}
