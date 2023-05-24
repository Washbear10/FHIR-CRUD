import { Box } from "@mui/system";
import React, { useContext, useEffect, useRef, useState } from "react";
import CodeableConcept from "../../../classes/dataTypes/CodeableConcept";
import Contact from "../../../classes/dataTypes/backboneElements/Patient/Contact";
import { ContactPoint } from "../../../classes/dataTypes/ContactPoint";
import { isObjectEmptyRecursive } from "../../../utilities/formatting/fhirify";
import { AttributeBlockErrorContext } from "../../../utilities/other/Contexts";
import DeleteableComponent from "../../common/DeleteableComponent";
import ExtendableComponent from "../../common/ExtendableComponent";
import Subcomponent from "../../common/Subcomponent";
import PeriodInput from "../../primitiveInputs/PeriodInput";
import AddressInput from "../AddressInput";
import CodeableConeptInput from "../CodeableConeptInput";
import GenderInput from "../GenderInput";
import HumanNameInput from "../HumanNameInput";
import ReferenceInput from "../ReferenceInput";
import TelecomInput from "../TelecomInput";
import {
	OrganizationAddressUse,
	OrganizationContactPointUse,
	contactEntityType,
} from "../../../utilities/valueSets/valueSets";
import { HumanName } from "../../../classes/dataTypes/HumanName";
import OrganizationContact from "../../../classes/dataTypes/backboneElements/Organization/OrganizationContact";

const OrganizationContactInput = ({ contact, changeContact }) => {
	const handleChangePurpose = (newPurpose) => {
		let newContact = new OrganizationContact({
			...contact,
			purpose: newPurpose,
		});
		changeContact(newContact, contact);
	};
	const handleChangeAddress = (newAddress) => {
		let newContact = new OrganizationContact({
			...contact,
			address: newAddress,
		});
		changeContact(newContact, contact);
	};

	const handleChangeTelecom = (newTelecom, oldTelecomIndex) => {
		let newTelecoms = [...contact.telecom];
		newTelecoms[oldTelecomIndex] = newTelecom;
		let newContact = new OrganizationContact({
			...contact,
			telecom: newTelecoms,
		});
		changeContact(newContact, contact);
	};

	const handleDeleteTelecom = (index) => {
		let newTelecoms = [...contact.telecom];
		newTelecoms.splice(index, 1);
		if (newTelecoms.length == 0) newTelecoms.push(new ContactPoint({}));
		let newContact = new OrganizationContact({
			...contact,
			telecom: newTelecoms,
		});
		changeContact(newContact, contact);
	};

	const handleAddTelecom = () => {
		let newTelecoms = [...contact.telecom];
		newTelecoms.push(new ContactPoint({}));
		let newContact = new OrganizationContact({
			...contact,
			telecom: newTelecoms,
		});
		changeContact(newContact, contact);
	};

	const handleChangeName = (newName, oldNameIndex) => {
		let newNames = [...contact.name];
		newNames[oldNameIndex] = newName;
		let newContact = new OrganizationContact({
			...contact,
			name: newNames,
		});
		changeContact(newContact, contact);
	};
	const handleDeleteName = (index) => {
		let newNames = [...contact.name];
		newNames.splice(index, 1);
		if (newNames.length == 0) newNames.push(new HumanName({}));
		let newContact = new OrganizationContact({
			...contact,
			name: newNames,
		});
		changeContact(newContact, contact);
	};

	const handleAddName = () => {
		let newNames = [...contact.name];
		newNames.push(new HumanName({}));
		let newContact = new OrganizationContact({
			...contact,
			name: newNames,
		});
		changeContact(newContact, contact);
	};

	const handleChangePeriod = (newPeriod) => {
		let newContact = new OrganizationContact({
			...contact,
			period: newPeriod,
		});
		changeContact(newContact, contact);
	};

	// render Section
	//
	return (
		<Box sx={{ display: "flex", flexDirection: "column", rowGap: "15px" }}>
			<CodeableConeptInput
				codeableConcept={contact.purpose}
				changeCodeableConcept={handleChangePurpose}
				systemEditable={false}
				bindingCodes={contactEntityType}
				defaultSystem="http://hl7.org/fhir/R4/valueset-contactentity-type.html"
			/>
			<AddressInput
				address={contact.address}
				changeSingleAddress={handleChangeAddress}
				allowedUse={OrganizationAddressUse}
			/>
			<Subcomponent
				title={"Telecom"}
				description="Contact details (e.g.phone/fax/url)"
			>
				<ExtendableComponent
					title="Add Telecom"
					handleExtend={() => {
						handleAddTelecom();
					}}
				>
					{contact
						? contact.telecom
							? contact.telecom
									.map((telecom, index) => {
										return {
											telecom: telecom,
											key: telecom.internalReactID,
											index: index,
										};
									})
									.map((telecom) => (
										<Box key={telecom.key}>
											<DeleteableComponent
												title="Delete this Telecom"
												handleDelete={() => {
													handleDeleteTelecom(telecom.index);
												}}
												disabled={
													contact.telecom.length == 1 &&
													isObjectEmptyRecursive(telecom.telecom)
												}
											>
												<TelecomInput
													telecom={telecom.telecom}
													changeTelecom={(newTelecom, oldTelecom) => {
														handleChangeTelecom(newTelecom, telecom.index);
													}}
													allowedUse={OrganizationContactPointUse}
												/>
											</DeleteableComponent>
										</Box>
									))
							: null
						: null}
				</ExtendableComponent>
			</Subcomponent>
			<PeriodInput period={contact.period} changePeriod={handleChangePeriod} />
			<Subcomponent
				title={"Name"}
				description="Name of an individual to contact"
			>
				<ExtendableComponent
					title="Add a name"
					handleExtend={() => {
						handleAddName();
					}}
				>
					{contact
						? contact.name
							? contact.name
									.map((name, index) => {
										return {
											name: name,
											key: name.internalReactID,
											index: index,
										};
									})
									.map((name) => (
										<Box key={name.key}>
											<DeleteableComponent
												title="Delete this name"
												handleDelete={() => {
													handleDeleteName(name.index);
												}}
												disabled={
													contact.name.length == 1 &&
													isObjectEmptyRecursive(name.name)
												}
											>
												<HumanNameInput
													name={name.name}
													changeSingleName={(newName, oldName) => {
														handleChangeName(newName, name.index);
													}}
												/>
											</DeleteableComponent>
										</Box>
									))
							: null
						: null}
				</ExtendableComponent>
			</Subcomponent>
			<ReferenceInput
				reference={contact.organization}
				changeReference={handleChangeReference}
				referenceOptions={{
					Organization: {
						displayAttribute: "name",
						paramsAndModifiers: ["name:contains"],
					},
				}}
			/>
		</Box>
	);
};

export default OrganizationContactInput;
