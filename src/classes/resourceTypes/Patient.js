import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { HumanName } from "../dataTypes/HumanName";
import { immerable } from "immer";
import removeInternalReactID, {
	clearObjectFromEmptyValues,
} from "../../utilities/fhirify";
import { Identifier } from "../dataTypes/Identifier";
import { ContactPoint } from "../dataTypes/ContactPoint";
import Address from "../dataTypes/Address";
import CodeableConcept from "../dataTypes/CodeableConcept";
import Contact from "../dataTypes/Contact";
import Communication from "../dataTypes/Communication";
import Reference from "../specialTypes/Reference";
import Link from "../dataTypes/Link";
import IdentifierDisplay from "../../components/elementDataGridDisplays.js/IdentifierDisplay";
import HumanNameDisplay from "../../components/elementDataGridDisplays.js/HumanNameDisplay";

export class Patient {
	[immerable] = true;

	constructor({
		id,
		active,
		name,
		gender,
		birthDate,
		deceasedBoolean,
		deceasedDateTime,
		identifier,
		telecom,
		address,
		maritalStatus,
		multipleBirthBoolean,
		multipleBirthInteger,
		contact,
		communication,
		generalPractitioner,
		managingOrganization,
		link,
	}) {
		this.id = id;
		this.name = name
			? name.map((singleName) => new HumanName({ ...singleName }))
			: [new HumanName({})];
		this.active = active;

		this.identifier = identifier
			? identifier.map(
					(singleIdentifier) => new Identifier({ ...singleIdentifier })
			  )
			: [new Identifier({})];

		this.gender = gender;
		this.birthDate = birthDate;
		this.deceasedBoolean = deceasedBoolean;
		this.deceasedDateTime = deceasedDateTime;
		this.multipleBirthBoolean = multipleBirthBoolean;
		this.multipleBirthInteger = multipleBirthInteger;
		this.telecom = telecom
			? telecom.map((singleTelecom) => new ContactPoint({ ...singleTelecom }))
			: [new ContactPoint({})];
		this.address = address
			? address.map((singleAddress) => new Address({ ...singleAddress }))
			: [new Address({})];
		this.maritalStatus = new CodeableConcept({ ...maritalStatus });
		this.multipleBirthBoolean = multipleBirthBoolean;
		this.multipleBirthInteger = multipleBirthInteger;
		this.contact = contact
			? contact.map((singleContact) => new Contact({ ...singleContact }))
			: [new Contact({})];
		this.communication = communication
			? communication.map((singleCom) => new Communication({ ...singleCom }))
			: [new Communication({})];
		this.generalPractitioner = generalPractitioner
			? generalPractitioner.map((singleGP) => new Reference({ ...singleGP }))
			: [new Reference({})];
		this.managingOrganization = new Reference({ ...managingOrganization });
		this.link = link
			? link.map((singleLink) => new Link({ ...singleLink }))
			: [new Link({})];
	}

	setDeceasedBoolean(newValue) {
		this.deceasedBoolean = newValue;
		this.deceasedDateTime = null;
	}
	setDeceasedDateTime(newValue) {
		this.deceasedDateTime = newValue;
		this.deceasedBoolean = null;
	}
	setMultipleBirthBoolean(newValue) {
		this.multipleBirthBoolean = newValue;
		this.multipleBirthInteger = null;
	}
	setMultipleBirthInteger(newValue) {
		this.multipleBirthInteger = newValue;
		this.multipleBirthBoolean = null;
	}

	static getAttributeDisplay(propertyName, propertyValue) {
		if (
			[
				"id",
				"active",
				"gender",
				"birthDate",
				"deceasedBoolean",
				"deceasedDateTime",
				"multipleBirthBoolean",
				"multipleBirthInteger",
			].includes(propertyName)
		) {
			return (
				<Typography>{propertyValue ? String(propertyValue) : ""}</Typography>
			);
		} else {
			switch (propertyName) {
				case "identifier":
					return <IdentifierDisplay identifier={propertyValue} />;
				case "name":
					return <HumanNameDisplay humanName={propertyValue} />;
				default:
					return <Box>ahlo</Box>;
			}
		}
	}

	toFHIRJson() {
		let o = JSON.parse(JSON.stringify(this));
		//removeInternalReactID(o);
		clearObjectFromEmptyValues(o);
		o.resourceType = "Patient";
		return JSON.stringify(o);
		//return JSON.stringify({ resourceType: "Patient", ...this });
	}
}
