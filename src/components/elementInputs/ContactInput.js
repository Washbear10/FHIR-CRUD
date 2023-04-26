import { Box } from "@mui/system";
import React, { useContext, useEffect, useRef, useState } from "react";
import CodeableConcept from "../../classes/dataTypes/CodeableConcept";
import Contact from "../../classes/dataTypes/Contact";
import DateTabs from "../common/DateTabs";
import DeleteableComponent from "../common/DeleteableComponent";
import ExtendableComponent from "../common/ExtendableComponent";
import Subcomponent from "../common/Subcomponent";
import CodeInput from "../primitiveInputs/CodeInput";
import AddressInput from "./AddressInput";
import CodeableConeptInput from "./CodeableConeptInput";
import HumanNameInput from "./HumanNameInput";
import TelecomInput from "./TelecomInput";
import { isObjectEmptyRecursive } from "../../utilities/fhirify";
import { ContactPoint } from "../../classes/dataTypes/ContactPoint";
import PeriodInput from "../primitiveInputs/PeriodInput";
import ReferenceInput from "./ReferenceInput";
import Reference from "../../classes/specialTypes/Reference";
import GenderInput from "./GenderInput";
import { AttributeBlockErrorContext } from "../../utilities/Contexts";

const genderValues = ["male", "female", "other", "unknown"];

const ContactInput = ({ contact, changeContact }) => {
	const [errorMessage, setErrorMessage] = useState("");

	const {
		attributeBlockError,
		setAttributeBlockError,
		attributeBlockErrorMessage,
		setAttributeBlockErrorMessage,
	} = useContext(AttributeBlockErrorContext);

	const wasMounted = useRef(false);
	useEffect(() => {
		if (wasMounted) checkInputValidity();
		else wasMounted.current = true;
	}, [contact]);

	const checkInputValidity = () => {
		console.log("checking valdity for contact: ", contact);
		if (
			isObjectEmptyRecursive(contact.name) &&
			isObjectEmptyRecursive(contact.address) &&
			isObjectEmptyRecursive(contact.telecom) &&
			isObjectEmptyRecursive(contact.organization) &&
			(!isObjectEmptyRecursive(contact.gender) ||
				!isObjectEmptyRecursive(contact.period) ||
				!isObjectEmptyRecursive(contact.relationship))
		) {
			setAttributeBlockError(true);
			setAttributeBlockErrorMessage(
				"At least on of name, address, telecom or organization must be supplied."
			);
			setErrorMessage("Todo");
		} else {
			setAttributeBlockError(false);
			setAttributeBlockErrorMessage("");
			setErrorMessage("");
		}
	};

	const handleChangeRelationship = (changedRelationship) => {
		let i = contact.relationship
			.map((item) => item.internalReactID)
			.indexOf(changedRelationship.internalReactID);
		let newRelationships = [...contact.relationship];
		newRelationships[i] = changedRelationship;
		let newContact = new Contact({
			...contact,
			relationship: newRelationships,
		});
		changeContact(newContact, contact);
	};

	const handleDeleteRelationship = (index) => {
		let newRelationships = [...contact.relationship];
		newRelationships.splice(index, 1);
		if (newRelationships.length == 0)
			newRelationships.push(new CodeableConcept({}));
		let newContact = new Contact({
			...contact,
			relationship: newRelationships,
		});

		changeContact(newContact, contact);
	};
	const handleAddRelationship = () => {
		let newRelationships = [...contact.relationship];
		newRelationships.push(new CodeableConcept({}));
		let newContact = new Contact({
			...contact,
			relationship: newRelationships,
		});

		changeContact(newContact, contact);
	};
	const handleChangeName = (newValue) => {
		let newContact = new Contact({ ...contact, name: newValue });
		changeContact(newContact, contact);
	};
	const handleChangeTelecom = (changedTelecom) => {
		let i = contact.telecom
			.map((item) => item.internalReactID)
			.indexOf(changedTelecom.internalReactID);
		let newTelecoms = [...contact.telecom];
		newTelecoms[i] = changedTelecom;
		let newContact = new Contact({
			...contact,
			telecom: newTelecoms,
		});
		changeContact(newContact, contact);
	};

	const handleDeleteTelecom = (index) => {
		let newTelecoms = [...contact.telecom];
		newTelecoms.splice(index, 1);
		if (newTelecoms.length == 0) newTelecoms.push(new ContactPoint({}));
		let newContact = new Contact({
			...contact,
			telecom: newTelecoms,
		});
		changeContact(newContact, contact);
	};
	const handleAddTelecom = () => {
		let newTelecoms = [...contact.telecom];

		newTelecoms.push(new ContactPoint({}));
		let newContact = new Contact({
			...contact,
			telecom: newTelecoms,
		});

		changeContact(newContact, contact);
	};
	const handleChangeAddress = (newValue) => {
		let newContact = new Contact({ ...contact, address: newValue });
		changeContact(newContact, contact);
	};
	const handleChangeGender = (newValue) => {
		let newContact = new Contact({ ...contact, gender: newValue });
		changeContact(newContact, contact);
	};
	const handleChangePeriod = (newValue) => {
		let newContact = new Contact({ ...contact, period: newValue });
		changeContact(newContact, contact);
	};
	const handleChangeOrganization = (newValue, oldValue) => {
		let newContact = new Contact({ ...contact, organization: newValue });
		changeContact(newContact, contact);
	};
	return (
		<Box sx={{ display: "flex", flexDirection: "column", rowGap: "15px" }}>
			<Subcomponent
				title={"Relationship"}
				description="The kind of relationship"
			>
				<ExtendableComponent
					handleExtend={handleAddRelationship}
					title="Add a relationship for this contact"
				>
					{contact.relationship
						.map((item, index) => {
							return {
								singleRelationship: item,
								key: item.internalReactID,
								index: index,
							};
						})
						.map((singleRelationship) => (
							<Box key={singleRelationship.key}>
								<DeleteableComponent
									title="Delete this relationship from the contact"
									handleDelete={() => {
										handleDeleteRelationship(singleRelationship.index);
									}}
									disabled={
										contact.relationship.length == 1 &&
										isObjectEmptyRecursive(contact.relationship)
									}
								>
									<Subcomponent>
										<CodeableConeptInput
											codeableConcept={singleRelationship.singleRelationship}
											changeCodeableConcept={handleChangeRelationship}
											systemEditable={false}
											defaultSystem="http://terminology.hl7.org/CodeSystem/v2-01312"
										/>
									</Subcomponent>
								</DeleteableComponent>
							</Box>
						))}
				</ExtendableComponent>
			</Subcomponent>
			<Subcomponent
				title={"Name"}
				description="A name associated with the contact person"
			>
				<HumanNameInput
					name={contact.name}
					changeSingleName={handleChangeName}
				/>
			</Subcomponent>
			<Subcomponent
				title={"Telecom"}
				description="Contact details for the contact person"
			>
				<ExtendableComponent
					handleExtend={handleAddTelecom}
					title="Add a telecom for this contact"
				>
					{contact.telecom
						.map((item, index) => {
							return {
								singleTelecom: item,
								key: item.internalReactID,
								index: index,
							};
						})
						.map((singleTelecom) => (
							<Box key={singleTelecom.key}>
								<DeleteableComponent
									title="Delete this telecom from the contact"
									handleDelete={() => {
										handleDeleteTelecom(singleTelecom.index);
									}}
									disabled={
										contact.telecom.length == 1 &&
										isObjectEmptyRecursive(contact.telecom)
									}
								>
									<Subcomponent>
										<TelecomInput
											telecom={singleTelecom.singleTelecom}
											changeTelecom={handleChangeTelecom}
										/>
									</Subcomponent>
								</DeleteableComponent>
							</Box>
						))}
				</ExtendableComponent>
			</Subcomponent>
			<Subcomponent
				title={"Address"}
				description="	Address for the contact person"
			>
				<AddressInput
					address={contact.address}
					changeSingleAddress={handleChangeAddress}
				/>
			</Subcomponent>
			<Subcomponent title={"Gender"} description="The contact person's gender">
				{/* <CodeInput values={genderValues} changeInput={handleChangeGender} /> */}
				<GenderInput
					gender={contact.gender}
					changeGender={handleChangeGender}
				/>
			</Subcomponent>
			<Subcomponent
				title={"Period"}
				description="Period during which this contact person or organization is valid to be contacted relating to this patient"
			>
				<PeriodInput
					period={contact.period}
					changePeriod={handleChangePeriod}
					maxWidth="400px"
				/>
			</Subcomponent>
			<Subcomponent
				title={"Organization"}
				description="Organization that is associated with the contact"
			>
				<ReferenceInput
					reference={contact.organization}
					changeReference={handleChangeOrganization}
					referenceOptions={{
						Organization: {
							displayAttribute: "name",
							paramsAndModifiers: ["name:contains"],
						},
					}}
				/>
			</Subcomponent>
		</Box>
	);
};

export default ContactInput;
