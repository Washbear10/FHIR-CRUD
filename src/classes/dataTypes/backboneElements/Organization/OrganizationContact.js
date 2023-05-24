import { v4 as uuidv4 } from "uuid";
import Period from "../../Period";
import Reference from "../../../specialTypes/Reference";
import Address from "../../Address";
import CodeableConcept from "../../CodeableConcept";
import { ContactPoint } from "../../ContactPoint";
import { HumanName } from "../../HumanName";
export default class OrganizationContact {
	constructor({ internalReactID, purpose, name, telecom, address }) {
		this.purpose = new CodeableConcept({ ...purpose });
		this.name = new HumanName({ ...name });
		this.telecom = telecom
			? telecom.map((item) => new ContactPoint({ ...item }))
			: [new ContactPoint({})];
		this.address = new Address({ ...address });
		this.internalReactID = internalReactID ? internalReactID : uuidv4();
	}

	calcDisplayString = () => {
		let s1 = "";
		this.name.prefix.forEach((pf) => {
			s1 += pf + " ";
		});
		if (this.name.family) s1 += this.name.family;
		s1 = s1.trim();
		let s3 = "";
		if (this.name.given)
			s3 += this.name.given.reduce((acc, curr) => acc + " " + curr, "");
		s3 = s3.trim();
		let final = [s1, s3].filter((item) => item).join(", ");
		return final;
	};
}
