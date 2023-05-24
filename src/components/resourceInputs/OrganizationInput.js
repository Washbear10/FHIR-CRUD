import { Button } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { HumanName } from "../../classes/dataTypes/HumanName";
import GenderInput from "../elementInputs/GenderInput";
import HumanNameInput from "../elementInputs/HumanNameInput";
import BooleanInput from "../primitiveInputs/BooleanInput";
import { DisabledTextField } from "../styledComponents/DisabledTextfield";

import { useEffect } from "react";
import Address from "../../classes/dataTypes/Address";
import Attachment from "../../classes/dataTypes/Attachment";
import Communication from "../../classes/dataTypes/Communication";
import Contact from "../../classes/dataTypes/backboneElements/Patient/Contact";
import { ContactPoint } from "../../classes/dataTypes/ContactPoint";
import { Identifier } from "../../classes/dataTypes/Identifier";
import Link from "../../classes/dataTypes/backboneElements/Patient/Link";
import Reference from "../../classes/specialTypes/Reference";
import { isObjectEmptyRecursive } from "../../utilities/formatting/fhirify";
import AttributeBlock from "../common/AttributeBlock";
import DateTabs from "../common/DateTabs";
import DeleteableComponent from "../common/DeleteableComponent";
import ExtendableComponent from "../common/ExtendableComponent";
import Subcomponent from "../common/Subcomponent";
import AddressInput from "../elementInputs/AddressInput";
import AttachmentInput from "../elementInputs/AttachmentInput";
import CodeableConeptInput from "../elementInputs/CodeableConeptInput";
import CommunicationInput from "../elementInputs/CommunicationInput";
import ContactInput from "../elementInputs/Patient/ContactInput";
import DeceasedInput from "../elementInputs/DeceasedInput";
import IdentifierInput from "../elementInputs/common/IdentifierInput";
import LinkInput from "../elementInputs/LinkInput";
import MultipleBirthInput from "../elementInputs/MultipleBirthInput";
import ReferenceInput from "../elementInputs/ReferenceInput";
import TelecomInput from "../elementInputs/TelecomInput";
import SmallTextField from "../styledComponents/SmallTextField";
import CodeableConcept from "../../classes/dataTypes/CodeableConcept";
import {
	OrganizationAddressUse,
	organizationType,
} from "../../utilities/valueSets/valueSets";

/**
 * Component rendered by InputDialog to display form to display and edit values of a Patient resource.
 * @param {*} resource The Patient instance (deserialized)
 * @param {*} modifyResource Callback to edit the resource
 * @returns
 */
const OrganizationInput = ({ resource, modifyResource }) => {
	// Section containing all the callbacks that are passed down the various Element input Components such as HumanNameInput.
	// They all work by basically the same by receiving an Instance of their respective data type and pushing to/removing from/changing the existing
	// data. Every function modifies the resource prop via the modifyResource callback (see InputDialog).

	const handleChangeSingleElement = (field, newValue) => {
		modifyResource(field, newValue);
	};

	const handleChangeAlias = (newValue, index) => {
		let newAliases = [...resource.alias];
		newAliases[index] = newValue;
		modifyResource("alias", newAliases);
	};
	const handleDeleteAlias = (index) => {
		let newAliases = [...resource.alias];
		newAliases.splice(index, 1);
		if (newAliases.length == 0) newAliases.push("");
		modifyResource("alias", newAliases);
	};

	const handleDeleteEndpoint = (key) => {
		const i = resource.endpoint
			.map((item) => item.internalReactID)
			.indexOf(key);
		let newEndpoints = [...resource.endpoint];
		newEndpoints.splice(i, 1);
		if (newEndpoints.length == 0) newEndpoints.push(new Reference({}));
		modifyResource("endpoint", newEndpoints);
	};
	// stateChange methods for identifier
	const handleDeleteIdentifier = (index) => {
		let newIdentifiers = [...resource.identifier];

		newIdentifiers.splice(index, 1);
		if (newIdentifiers.length == 0) newIdentifiers.push(new Identifier({}));
		modifyResource("identifier", newIdentifiers);
	};
	const addIdentifier = () => {
		let newIdentifiers = [...resource.identifier];
		newIdentifiers.push(new Identifier({}));
		modifyResource("identifier", newIdentifiers);
	};
	const changeIdentifier = (newValue, oldValue) => {
		const i = resource.identifier
			.map((item) => item.internalReactID)
			.indexOf(oldValue.internalReactID);
		let newIdentifiers = [...resource.identifier];
		newIdentifiers[i] = newValue;
		modifyResource("identifier", newIdentifiers);
	};
	const handleChangeEndpoint = (newEndpoint, oldEndpoint) => {
		const i = resource.endpoint
			.map((item) => item.internalReactID)
			.indexOf(oldEndpoint.internalReactID);
		let newEndpoints = [...resource.endpoint];
		newEndpoints[i] = newEndpoint;
		modifyResource("endpoint", newEndpoints);
	};

	const handleDeleteType = (key) => {
		const i = resource.type.map((item) => item.internalReactID).indexOf(key);
		let newTypes = [...resource.type];
		newTypes.splice(i, 1);
		if (newTypes.length == 0) newTypes.push(new CodeableConcept({}));
		modifyResource("type", newTypes);
	};

	const handleChangeType = (newValue, oldValue) => {
		console.log(newValue, oldValue);
		const i = resource.type
			.map((item) => item.internalReactID)
			.indexOf(oldValue.internalReactID);
		let newTypes = [...resource.type];
		newTypes[i] = newValue;
		modifyResource("type", newTypes);
	};

	const handleDeleteAddress = (key) => {
		const i = resource.address.map((item) => item.internalReactID).indexOf(key);
		let newAddresses = [...resource.address];
		newAddresses.splice(i, 1);
		if (newAddresses.length == 0) newAddresses.push(new Address({}));
		modifyResource("address", newAddresses);
	};

	const handleChangeAddress = (newValue, oldValue) => {
		const i = resource.address
			.map((item) => item.internalReactID)
			.indexOf(oldValue.internalReactID);
		let newAddresses = [...resource.address];
		newAddresses[i] = newValue;
		modifyResource("address", newAddresses);
	};

	const handleDeleteTelecom = (key) => {
		const i = resource.telecom.map((item) => item.internalReactID).indexOf(key);
		let newTelecoms = [...resource.telecom];
		newTelecoms.splice(i, 1);
		if (newTelecoms.length == 0) newTelecoms.push(new ContactPoint({}));
		modifyResource("telecom", newTelecoms);
	};

	const handleChangeTelecom = (newValue, oldValue) => {
		const i = resource.telecom
			.map((item) => item.internalReactID)
			.indexOf(oldValue.internalReactID);
		let newTelecoms = [...resource.telecom];
		newTelecoms[i] = newValue;
		modifyResource("telecom", newTelecoms);
	};

	// render section:

	/**
	 * Every element of Patient is contained in an AttributeBlock. Elements with cardinality > 1 are wrapped in ExtendableComponents and DeletableComponents
	 * and are mapped over to give each instance its own Input. Check Identifier Block for example and explanation.
	 *
	 */
	return (
		<Box>
			<AttributeBlock
				attributeName="Resource Type"
				attributeDescription="The Type of this resource"
				attributeLink={"https://www.hl7.org/fhir/organization.html#resource"}
				inputComponents={
					<DisabledTextField fullWidth disabled placeholder="Organization" />
				}
				renderKey={"Organization"}
			/>
			<AttributeBlock
				attributeName="ID"
				attributeDescription="The unique ID for this resource"
				attributeLink={
					"https://www.hl7.org/fhir/types-definitions.html#Element.id"
				}
				inputComponents={
					<DisabledTextField
						fullWidth
						disabled
						placeholder={resource ? resource.id : null}
					/>
				}
				renderKey={resource ? resource.id : null}
			/>
			<AttributeBlock
				attributeName="Name"
				attributeDescription="Name used for the organization"
				renderKey={resource ? resource.name : null}
				attributeLink={"https://www.hl7.org/fhir/datatypes.html#HumanName"}
				inputComponents={
					<SmallTextField
						value={resource.name}
						onChange={(e) => {
							handleChangeSingleElement("name", e.target.value);
						}}
					/>
				}
			/>
			<AttributeBlock
				attributeName="Alias"
				attributeDescription="Alias used for the organization"
				renderKey={resource ? resource.alias : null}
				attributeLink={"https://www.hl7.org/fhir/datatypes.html#HumanName"}
				inputComponents={
					<>
						<ExtendableComponent
							title="Add Alias"
							handleExtend={() => {
								modifyResource("alias", [...resource.alias, ""]);
							}}
							gap="1rem"
						>
							{resource
								? resource.alias
									? resource.alias
											.map((singleAlias, index) => {
												return {
													singleAlias: singleAlias,
													index: index,
												};
											})
											.map((singleAlias) => {
												return (
													<Box key={singleAlias.index}>
														<DeleteableComponent
															title="Delete this Alias"
															handleDelete={() => {
																handleDeleteAlias(singleAlias.index);
															}}
															disabled={
																resource.alias.length == 1 &&
																isObjectEmptyRecursive(resource.alias)
															}
														>
															<SmallTextField
																value={singleAlias.singleAlias}
																onChange={(e) => {
																	handleChangeAlias(
																		e.target.value,
																		singleAlias.index
																	);
																}}
															/>
														</DeleteableComponent>
													</Box>
												);
											})
									: null
								: null}
						</ExtendableComponent>
					</>
				}
			/>
			<AttributeBlock
				attributeName="Active"
				attributeDescription="Whether the organization's record is still in active use"
				renderKey={resource ? resource.active : null}
				attributeLink={
					"https://www.hl7.org/fhir/organization-definitions.html#Organization.active"
				}
				inputComponents={
					<BooleanInput
						title={"active?"}
						checked={resource.active}
						changeChecked={(newValue) => {
							handleChangeSingleElement("active", newValue);
						}}
					/>
				}
			/>

			<AttributeBlock
				attributeName="Part of"
				attributeDescription="The organization of which this organization forms a part"
				attributeLink={"https://www.hl7.org/fhir/references.html#Reference"}
				renderKey={resource ? resource.partOf : null}
				inputComponents={
					<ReferenceInput
						reference={resource.partOf}
						changeReference={(newReference, oldReference) => {
							handleChangeSingleElement("partOf", newReference);
						}}
						referenceOptions={{
							Organization: {
								displayAttribute: "name",
								paramsAndModifiers: ["name:contains"],
							},
						}}
					/>
				}
			/>
			<AttributeBlock
				attributeName="Endpoint"
				attributeDescription="Technical endpoints providing access to services operated for the organization"
				renderKey={resource ? resource.endpoint : null}
				attributeLink={
					"https://www.hl7.org/fhir/organization-definitions.html#Organization.endpoint"
				}
				inputComponents={
					<>
						<ExtendableComponent
							title="Add endpoint"
							handleExtend={() => {
								modifyResource("endpoint", [
									...resource.endpoint,
									new Reference({}),
								]);
							}}
							gap="1rem"
						>
							{resource
								? resource.endpoint
									? resource.endpoint
											.map((singleEndpoint, index) => {
												return {
													singleEndpoint: singleEndpoint,
													index: index,
													key: singleEndpoint.internalReactID,
												};
											})
											.map((singleEndpoint) => {
												return (
													<Box key={singleEndpoint.key}>
														<DeleteableComponent
															title="Delete this endpoint"
															handleDelete={() => {
																handleDeleteEndpoint(singleEndpoint.key);
															}}
															disabled={
																resource.endpoint.length == 1 &&
																isObjectEmptyRecursive(resource.endpoint)
															}
														>
															<ReferenceInput
																reference={singleEndpoint.singleEndpoint}
																changeReference={handleChangeEndpoint}
																referenceOptions={{
																	Endpoint: {
																		displayAttribute: "name",
																		paramsAndModifiers: ["name:contains"],
																	},
																}}
															/>
														</DeleteableComponent>
													</Box>
												);
											})
									: null
								: null}
						</ExtendableComponent>
					</>
				}
			/>
			<AttributeBlock
				attributeName="Identifier"
				attributeDescription="Identifies this organization across multiple systems"
				renderKey={resource ? resource.identifier : null} // used for memoization
				attributeLink={"https://www.hl7.org/fhir/datatypes.html#identifier"}
				inputComponents={
					<ExtendableComponent // Identifier cardinality > 1 -> can add new Identifiers
						title="Add identifier"
						handleExtend={() => {
							addIdentifier();
						}}
					>
						{resource
							? resource.identifier
								? resource.identifier
										.map((singleIdentifier, index) => {
											// helper object to get index and internalReactID as key for the component in the list
											return {
												idf: singleIdentifier,
												key: singleIdentifier.internalReactID,
												index: index,
											};
										})
										.map((singleIdentifierObj) => {
											// return Component for this single Identifier
											return (
												<Box key={singleIdentifierObj.key}>
													<DeleteableComponent // cardinality > 1 -> identifier can be deleted
														title="Delete this identifier"
														handleDelete={() => {
															handleDeleteIdentifier(singleIdentifierObj.index);
														}}
														disabled={
															resource.identifier.length == 1 &&
															isObjectEmptyRecursive(resource.identifier)
														}
													>
														<Subcomponent>
															<IdentifierInput // The component to render a single Identifier in the list of identifiers
																identifier={singleIdentifierObj.idf}
																changeIdentifier={changeIdentifier}
															/>
														</Subcomponent>
													</DeleteableComponent>
												</Box>
											);
										})
								: null
							: null}
					</ExtendableComponent>
				}
			/>
			<AttributeBlock
				attributeName="Type"
				attributeDescription="Kind of organization"
				renderKey={resource ? resource.type : null} // used for memoization
				attributeLink={
					"https://www.hl7.org/fhir/organization-definitions.html#Organization.type"
				}
				inputComponents={
					<ExtendableComponent // Identifier cardinality > 1 -> can add new Identifiers
						title="Add type"
						handleExtend={() => {
							modifyResource("type", [
								...resource.type,
								new CodeableConcept({}),
							]);
						}}
					>
						{resource
							? resource.type
								? resource.type
										.map((singleType, index) => {
											// helper object to get index and internalReactID as key for the component in the list
											return {
												singleType: singleType,
												key: singleType.internalReactID,
												index: index,
											};
										})
										.map((singleType) => {
											// return Component for this single Identifier
											return (
												<Box key={singleType.key}>
													<DeleteableComponent // cardinality > 1 -> identifier can be deleted
														title="Delete this type"
														handleDelete={() => {
															handleDeleteType(singleType.key);
														}}
														disabled={
															resource.type.length == 1 &&
															isObjectEmptyRecursive(resource.type)
														}
													>
														<Subcomponent>
															<CodeableConeptInput
																defaultSystem="http://hl7.org/fhir/ValueSet/organization-type"
																bindingCodes={organizationType}
																systemValueCombinationRequired={false}
																codeableConcept={singleType.singleType}
																changeCodeableConcept={handleChangeType}
																clearOnBlur={false}
															/>
														</Subcomponent>
													</DeleteableComponent>
												</Box>
											);
										})
								: null
							: null}
					</ExtendableComponent>
				}
			/>

			<AttributeBlock
				attributeName="Address"
				attributeDescription="An address for the organization"
				renderKey={resource ? resource.address : null} // used for memoization
				attributeLink={
					"http://hl7.org/fhir/R4/organization-definitions.html#Organization.address"
				}
				inputComponents={
					<ExtendableComponent // Identifier cardinality > 1 -> can add new Identifiers
						title="Add address"
						handleExtend={() => {
							modifyResource("address", [...resource.address, new Address({})]);
						}}
					>
						{resource
							? resource.address
								? resource.address
										.map((singleAddress, index) => {
											// helper object to get index and internalReactID as key for the component in the list
											return {
												singleAddress: singleAddress,
												key: singleAddress.internalReactID,
												index: index,
											};
										})
										.map((singleAddress) => {
											// return Component for this single Identifier
											return (
												<Box key={singleAddress.key}>
													<DeleteableComponent // cardinality > 1 -> identifier can be deleted
														title="Delete this address"
														handleDelete={() => {
															handleDeleteAddress(singleAddress.key);
														}}
														disabled={
															resource.address.length == 1 &&
															isObjectEmptyRecursive(resource.address)
														}
													>
														<Subcomponent>
															<AddressInput
																address={singleAddress.singleAddress}
																changeSingleAddress={handleChangeAddress}
																allowedUse={OrganizationAddressUse}
															/>
														</Subcomponent>
													</DeleteableComponent>
												</Box>
											);
										})
								: null
							: null}
					</ExtendableComponent>
				}
			/>
			<AttributeBlock
				attributeName="Telecom"
				attributeDescription="A contact detail for the organization"
				renderKey={resource ? resource.telecom : null} // used for memoization
				attributeLink={
					"http://hl7.org/fhir/R4/organization-definitions.html#Organization.telecom"
				}
				inputComponents={
					<ExtendableComponent // Identifier cardinality > 1 -> can add new Identifiers
						title="Add telecom"
						handleExtend={() => {
							modifyResource("telecom", [
								...resource.telecom,
								new ContactPoint({}),
							]);
						}}
					>
						{resource
							? resource.telecom
								? resource.telecom
										.map((singleTelecom, index) => {
											// helper object to get index and internalReactID as key for the component in the list
											return {
												singleTelecom: singleTelecom,
												key: singleTelecom.internalReactID,
												index: index,
											};
										})
										.map((singleTelecom) => {
											// return Component for this single Identifier
											return (
												<Box key={singleTelecom.key}>
													<DeleteableComponent // cardinality > 1 -> identifier can be deleted
														title="Delete this telecom"
														handleDelete={() => {
															handleDeleteTelecom(singleTelecom.key);
														}}
														disabled={
															resource.telecom.length == 1 &&
															isObjectEmptyRecursive(resource.telecom)
														}
													>
														<Subcomponent>
															<TelecomInput
																telecom={singleTelecom.singleTelecom}
																changeTelecom={handleChangeTelecom}
																allowedUse={OrganizationAddressUse}
															/>
														</Subcomponent>
													</DeleteableComponent>
												</Box>
											);
										})
								: null
							: null}
					</ExtendableComponent>
				}
			/>
		</Box>
	);
};

export default OrganizationInput;
