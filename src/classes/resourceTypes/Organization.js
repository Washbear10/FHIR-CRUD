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
import { ExtendedContactDetail } from "../dataTypes/ExtendedContactDetail";
import Qualification from "../dataTypes/backboneElements/Organization/Qualification";
import OrganizationContact from "../dataTypes/backboneElements/Organization/OrganizationContact";

export class Organization {
	[immerable] = true;

	constructor({
		id,
		identifier,
		active,
		type,
		name,
		alias,
		contact,
		telecom,
		address,
		partOf,
		endpoint,
	}) {
		this.id = id;
		this.identifier = identifier
			? identifier.map(
					(singleIdentifier) => new Identifier({ ...singleIdentifier })
			  )
			: [new Identifier({})];
		this.name = name;
		this.active = active;
		this.type = type
			? type.map((singleType) => new CodeableConcept({ ...singleType }))
			: [new CodeableConcept({})];
		this.alias = alias || [""];
		this.contact = contact
			? contact.map(
					(singleContact) => new OrganizationContact({ ...singleContact })
			  )
			: [new OrganizationContact({})];
		this.address = address
			? address.map((singleAddress) => new Address({ ...singleAddress }))
			: [new Address({})];
		this.telecom = telecom
			? telecom.map((singleTelecom) => new ContactPoint({ ...singleTelecom }))
			: [new ContactPoint({})];
		this.partOf = new Reference({ ...partOf });
		this.endpoint = endpoint
			? endpoint.map((singleEndpoint) => new Reference({ ...singleEndpoint }))
			: [new Reference({})];
		this.internalReactExpanded = false;
	}

	// this is for getting the Classname when the javascript code is webpack bundled, as then classnames will be substituted by "e"
	static get getResourceName() {
		return "Organization";
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
			["id", "name", "alias", "description", "active"].includes(propertyName)
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
				case "type":
				case "contact":
				case "address":
				case "telecom":
				case "partOf":
				case "endpoint":
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
		o.resourceType = "Organization";
		return JSON.stringify(o);
	}
}
