import { HumanName } from "../classes/dataTypes/HumanName";
import { Patient } from "../classes/resourceTypes/Patient";
import { Identifier } from "../classes/dataTypes/Identifier";
export const resourcesAttributes = {
	Patient: [
		"identifier",
		"id",
		"active",
		"name",
		"gender",
		"birthDate",
		"deceased",
	],
	Observation: ["id", "identifier", "triggeredBy", "status", "issued", "note"],
};

export const createResourceInstance = (type, resourceAsJSON) => {
	if (type == "Patient") {
		const p = new Patient({
			...resourceAsJSON,
			name: resourceAsJSON.name
				? resourceAsJSON.name.map(
						(nameEntry) => new HumanName({ ...nameEntry })
				  )
				: null,
			identifier: resourceAsJSON.identifier
				? resourceAsJSON.identifier.map(
						(identifierEntry) => new Identifier({ ...identifierEntry })
				  )
				: null,
		});

		return p;
	}
};

export const dataTypes = {
	HumanName: { use: "code", text: "string", family: "string" },
};
