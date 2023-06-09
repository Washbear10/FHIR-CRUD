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
	const handleChangeAddress = (newAddress, oldAddressIndex) => {
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
		let newContact = new OrganizationContact({ ...contact, name: newName });
		changeContact(newContact, contact);
	};

	// render Section
	//
	return (
		<Box sx={{ display: "flex", flexDirection: "column", rowGap: "15px" }}>
			<Subcomponent
				title={"Name"}
				description="Name of an individual to contact"
			>
				<HumanNameInput
					name={contact.name}
					changeSingleName={(newName, oldName) => {
						handleChangeName(newName);
					}}
				/>
			</Subcomponent>

			<Subcomponent
				title={"Address"}
				description="Visiting or postal addresses for the contact"
			>
				<AddressInput
					address={contact.address}
					changeSingleAddress={handleChangeAddress}
				/>
			</Subcomponent>
			<Subcomponent
				title={"Telecom"}
				description="Contact details (telephone, email, etc.) for a contact"
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
												/>
											</DeleteableComponent>
										</Box>
									))
							: null
						: null}
				</ExtendableComponent>
			</Subcomponent>
			<Subcomponent title={"Purpose"} description="The type of contact">
				<CodeableConeptInput
					codeableConcept={contact.purpose}
					changeCodeableConcept={handleChangePurpose}
					systemEditable={false}
					bindingCodes={contactEntityType}
					codesLink="http://hl7.org/fhir/R4/codesystem-contactentity-type.html#4.3.14.457.2"
					defaultSystem="http://hl7.org/fhir/R4/valueset-contactentity-type.html"
				/>
			</Subcomponent>
		</Box>
	);
};

export default OrganizationContactInput;
