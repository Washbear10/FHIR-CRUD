import Reference from "../specialTypes/Reference";
import Address from "./Address";
import CodeableConcept from "./CodeableConcept";
import { ContactPoint } from "./ContactPoint";
import { HumanName } from "./HumanName";
import Period from "../../classes/dataTypes/Period";
import { v4 as uuidv4 } from "uuid";
export default class Contact {
	constructor({
		internalReactID,
		relationship,
		name,
		telecom,
		address,
		gender,
		organization,
		period,
	}) {
		this.relationship = relationship
			? relationship.map((item) => new CodeableConcept({ ...item }))
			: [new CodeableConcept({})];
		this.name = new HumanName({ ...name });
		this.telecom = telecom
			? telecom.map((item) => new ContactPoint({ ...item }))
			: [new ContactPoint({})];
		this.address = new Address({ ...address });
		this.gender = gender;
		this.period = new Period({ ...period });
		this.organization = new Reference({ ...organization });
		this.internalReactID = internalReactID ? internalReactID : uuidv4();
	}
}