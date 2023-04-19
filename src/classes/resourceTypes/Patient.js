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
import ContactPointDisplay from "../../components/elementDataGridDisplays.js/ContactPointDisplay";
import { Stack } from "@mui/system";
import ExpandableCell from "../../utilities/renderCellExpand";

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

		this.internalReactExpanded = false;
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

	static getAttributeDisplay(propertyName, propertyValue, rowExpanded) {
		console.log(rowExpanded);
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
				<ExpandableCell
					value={propertyValue ? String(propertyValue) : ""}
					lengthThreshhold={50}
					rowExpanded={rowExpanded}
				/>
			);
		} else {
			switch (propertyName) {
				case "identifier":
					return (
						<Stack>
							{propertyValue.map((singleIdentifier) => (
								<IdentifierDisplay identifier={singleIdentifier} />
							))}
						</Stack>
					);
				case "name":
					let namesString = propertyValue
						.map((name) => name.calcDisplayString())
						.join("\n");
					console.log(namesString);
					return (
						<ExpandableCell
							value={namesString || ""}
							lengthThreshhold={100}
							rowExpanded={rowExpanded}
						/>
					);

				case "telecom" /* return (
						<Stack sx={{ maxWidth: "100%", width: "100%" }}>
							{propertyValue.map((singleTelecom) => (
								<ContactPointDisplay contactPoint={singleTelecom} />
							))}
						</Stack>
					); */: {
					let s = propertyValue
						.map((singleTelecom) => singleTelecom.value)
						.join(";abc");
					return s;
				}
				case "telecom":
					return (
						<Stack>
							{propertyValue.map((singleTelecom) => (
								<ContactPointDisplay contactPoint={singleTelecom} />
							))}
						</Stack>
					);

				default:
					return (
						<Box>
							<small>(no display)</small>
						</Box>
					);
			}
		}
	}

	toFHIRJson() {
		let o = JSON.parse(JSON.stringify(this));
		clearObjectFromEmptyValues(o);
		o.resourceType = "Patient";
		return JSON.stringify(o);
	}
}
