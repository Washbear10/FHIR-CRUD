import { v4 as uuidv4 } from "uuid";
import Period from "../../Period";
import Reference from "../../../specialTypes/Reference";
import Address from "../../Address";
import CodeableConcept from "../../CodeableConcept";
import { ContactPoint } from "../../ContactPoint";
import { Identifier } from "../../Identifier";
import { HumanName } from "../../HumanName";

export default class Qualification {
	constructor({ internalReactID, identifier, code, period, issuer }) {
		this.identifier = identifier
			? identifier.map(
					(singleIdentifier) => new Identifier({ ...singleIdentifier })
			  )
			: [new Identifier({})];
		this.code = new CodeableConcept({ ...code });
		this.period = new Period({ ...period });
		this.issuer = new Reference({ ...issuer });
		this.internalReactID = internalReactID ? internalReactID : uuidv4();
	}

	calcDisplayString = () => {
		return this.code;
	};
}
