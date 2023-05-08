import { Box } from "@mui/system";
import { immerable } from "immer";
import ExpandableCell from "../../components/datagrid/renderCellExpand";
import { clearObjectFromEmptyValues } from "../../utilities/formatting/fhirify";
import Address from "../dataTypes/Address";
import Attachment from "../dataTypes/Attachment";
import CodeableConcept from "../dataTypes/CodeableConcept";
import Communication from "../dataTypes/Communication";
import Contact from "../dataTypes/backboneElements/Patient/Contact";
import { ContactPoint } from "../dataTypes/ContactPoint";
import { HumanName } from "../dataTypes/HumanName";
import { Identifier } from "../dataTypes/Identifier";
import Link from "../dataTypes/backboneElements/Patient/Link";
import Reference from "../specialTypes/Reference";

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
		photo,
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

		this.photo = photo
			? photo.map((singlePhoto) => new Attachment({ ...singlePhoto }))
			: [new Attachment({})];

		this.internalReactExpanded = false;
	}

	// this is for getting the Classname when the javascript code is webpack bundled, as then classnames will be substituted by "e"
	static get getResourceName() {
		return "Patient";
	}

	// custom setters for attributes that are mutually exclusive
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

	/**
	 *  method to return the React component rendered within the datagrid for a given property
	 * @param {*} propertyName The name of the attribute/property that has to be displayed
	 * @param {*} propertyValue The value of the attribute/property
	 * @param {*} rowExpanded Whether the datagrid row is expanded or not (affects how it should be displayed)
	 * @returns ExpandableCell.jsx component
	 */
	static getAttributeDisplay(propertyName, propertyValue, rowExpanded) {
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
			/* return "abcabcacbacbacbacbacbacbacbacb"; */
		} else {
			switch (propertyName) {
				case "identifier":
				case "name":
				case "telecom":
				case "address":
				case "contact":
				case "communication":
				case "generalPractitioner":
				case "managingOrganization":
				case "link":
				case "maritalStatus":
					let propertyValueString = Array.isArray(propertyValue)
						? propertyValue
								.map((singleItem) => singleItem.calcDisplayString())
								.join("\n")
						: propertyValue.calcDisplayString();
					return (
						<ExpandableCell
							value={propertyValueString || ""}
							lengthThreshhold={100}
							rowExpanded={rowExpanded}
						/>
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

	/**
	 * Method to format a class instance to a JSON string without empty values / objects.
	 * @returns Instance object as FHIR JSON string.
	 */
	toFHIRJson() {
		let o = JSON.parse(JSON.stringify(this));
		clearObjectFromEmptyValues(o);
		o.resourceType = "Patient";
		return JSON.stringify(o);
	}
}
