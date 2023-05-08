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

/**
 * Component rendered by InputDialog to display form to display and edit values of a Patient resource.
 * @param {*} resource The Patient instance (deserialized)
 * @param {*} modifyResource Callback to edit the resource
 * @returns
 */
const PatientInput = ({ resource, modifyResource }) => {
	// stuff to check wether the photo upload limit is exceeded
	const [totalPhotoSize, setTotalPhotoSize] = useState(0);
	useEffect(() => {
		setTotalPhotoSize(calcTotalPhotoSize());
	}, [resource.photo]);
	function calcTotalPhotoSize() {
		if (resource && resource.photo) {
			let sum = 0;
			resource.photo.forEach((photo) => {
				if (photo.data) {
					const size = new TextEncoder().encode(photo.data).length;
					sum += size ? size : 0;
				}
			});
			return sum;
		}
		return 0;
	}

	// Section containing all the callbacks that are passed down the various Element input Components such as HumanNameInput.
	// They all work by basically the same by receiving an Instance of their respective data type and pushing to/removing from/changing the existing
	// data. Every function modifies the resource prop via the modifyResource callback (see InputDialog).

	// stateChange methods for Gender
	const changeGender = (newValue) => {
		modifyResource("gender", newValue);
	};

	// stateChange methods for identifier
	const handleDeleteIdentifier = (index) => {
		/* let newIdentifiers = cloneElementList("identifier"); */
		let newIdentifiers = [...resource.identifier];

		newIdentifiers.splice(index, 1);
		if (newIdentifiers.length == 0) newIdentifiers.push(new Identifier({}));
		modifyResource("identifier", newIdentifiers);
	};
	const addIdentifier = () => {
		/* let newIdentifiers = cloneElementList("identifier"); */
		let newIdentifiers = [...resource.identifier];
		newIdentifiers.push(new Identifier({}));
		modifyResource("identifier", newIdentifiers);
	};
	//stateChange methods for Name
	const addName = () => {
		let newNames = [...resource.name];

		newNames.push(new HumanName({}));
		modifyResource("name", newNames);
	};

	const handleDeleteName = (index) => {
		let newNames = [...resource.name];
		newNames.splice(index, 1);
		if (newNames.length == 0) newNames.push(new HumanName({}));
		modifyResource("name", newNames);
	};
	const changeSingleName = (newValue, oldValue) => {
		const i = resource.name
			.map((item) => item.internalReactID)
			.indexOf(oldValue.internalReactID);
		let newNames = [...resource.name];
		newNames[i] = newValue;
		modifyResource("name", newNames);
	};

	const changeActive = (newValue) => {
		let value = typeof newValue === "boolean" ? newValue : null;
		modifyResource("active", value);
	};

	const changeBirthDate = (newValue) => {
		modifyResource("birthDate", newValue);
	};

	const changeDeceasedBoolean = (newValue) => {
		modifyResource("deceasedBoolean", newValue);
	};

	const changeDeceasedDateTime = (newValue) => {
		modifyResource("deceasedDateTime", newValue);
	};

	const changeIdentifier = (newValue, oldValue) => {
		const i = resource.identifier
			.map((item) => item.internalReactID)
			.indexOf(oldValue.internalReactID);
		//let newNames = cloneNameList();
		let newIdentifiers = [...resource.identifier];
		newIdentifiers[i] = newValue;
		modifyResource("identifier", newIdentifiers);
	};

	const changeTelecom = (newValue, oldValue) => {
		//const i = resource.telecom.indexOf(oldValue);
		const i = resource.telecom
			.map((item) => item.internalReactID)
			.indexOf(oldValue.internalReactID);
		let newTelecoms = [...resource.telecom];
		newTelecoms[i] = newValue;
		modifyResource("telecom", newTelecoms);
	};

	const addTelecom = () => {
		/* let newContacts = cloneElementList("telecom"); */
		let newContacts = [...resource.telecom];
		newContacts.push(new ContactPoint({}));
		modifyResource("telecom", newContacts);
	};
	const handleDeleteTelecom = (index) => {
		/* let newContacts = cloneElementList("telecom"); */
		let newContacts = [...resource.telecom];
		newContacts.splice(index, 1);
		if (newContacts.length == 0) newContacts.push(new HumanName({}));
		modifyResource("telecom", newContacts);
	};
	const changeSingleAddress = (newValue, oldValue) => {
		const i = resource.address
			.map((item) => item.internalReactID)
			.indexOf(oldValue.internalReactID);
		let newAddresses = [...resource.address];
		newAddresses[i] = newValue;
		modifyResource("address", newAddresses);
	};

	const addAddress = () => {
		let newAddresses = [...resource.address];
		newAddresses.push(new Address({}));
		modifyResource("address", newAddresses);
	};
	const handleDeleteAddress = (index) => {
		let newAddresses = [...resource.address];
		newAddresses.splice(index, 1);
		if (newAddresses.length == 0) newAddresses.push(new Address({}));
		modifyResource("address", newAddresses);
	};

	const changeMaritalStatus = (newValue) => {
		modifyResource("maritalStatus", newValue);
	};

	const changeMultipleBirthBoolean = (newValue) => {
		modifyResource("multipleBirthBoolean", newValue);
	};
	const changeMultipleBirthInteger = (newValue) => {
		modifyResource(
			"multipleBirthInteger",
			Number.isInteger(parseInt(newValue)) ? parseInt(newValue) : null
		);
	};
	const changeContact = (newValue, oldValue) => {
		const i = resource.contact
			.map((item) => item.internalReactID)
			.indexOf(oldValue.internalReactID);
		let newContacts = [...resource.contact];
		newContacts[i] = newValue;
		modifyResource("contact", newContacts);
	};

	const handleDeleteCommunication = (index) => {
		let newComs = [...resource.communication];
		newComs.splice(index, 1);
		if (newComs.length == 0) newComs.push(new Communication({}));
		modifyResource("communication", newComs);
	};

	const changeCommunication = (newValue, oldValue) => {
		const i = resource.communication
			.map((item) => item.internalReactID)
			.indexOf(oldValue.internalReactID);
		let newComs = [...resource.communication];
		newComs[i] = newValue;
		modifyResource("communication", newComs);
	};

	const handleDeleteContact = (index) => {
		let newContacts = [...resource.contact];
		newContacts.splice(index, 1);
		if (newContacts.length == 0) newContacts.push(new Contact({}));
		modifyResource("contact", newContacts);
	};

	const addGeneralPractitioner = () => {
		let newGPs = [...resource.generalPractitioner];
		newGPs.push(new Reference({}));
		modifyResource("generalPractitioner", newGPs);
	};

	const handleDeleteGeneralPractitioner = (index) => {
		let newGPs = [...resource.generalPractitioner];
		newGPs.splice(index, 1);
		if (newGPs.length == 0) newGPs.push(new Reference({}));
		modifyResource("generalPractitioner", newGPs);
	};

	const handleChangeGeneralPracticioner = (newValue, oldValue) => {
		const i = resource.generalPractitioner
			.map((item) => item.internalReactID)
			.indexOf(oldValue.internalReactID);
		let newGPs = [...resource.generalPractitioner];
		newGPs[i] = newValue;
		modifyResource("generalPractitioner", newGPs);
	};

	const handleChangeManagingOrganization = (newValue) => {
		modifyResource("managingOrganization", newValue);
	};

	const addLink = () => {
		let newLinks = [...resource.link];
		newLinks.push(new Link({}));
		modifyResource("link", newLinks);
	};

	const handleDeleteLink = (index) => {
		let newLinks = [...resource.link];
		newLinks.splice(index, 1);
		if (newLinks.length == 0) newLinks.push(new Link({}));
		modifyResource("link", newLinks);
	};

	const changeLink = (newValue, oldValue) => {
		const i = resource.link
			.map((item) => item.internalReactID)
			.indexOf(oldValue.internalReactID);
		let newLinks = [...resource.link];
		newLinks[i] = newValue;
		modifyResource("link", newLinks);
	};

	// changing photos:

	const changePhoto = (newValue, oldValue) => {
		const i = resource.photo
			.map((item) => item.internalReactID)
			.indexOf(oldValue.internalReactID);
		let newPhotos = [...resource.photo];
		newPhotos[i] = newValue;
		modifyResource("photo", newPhotos);
	};
	const handleDeletePhoto = (index) => {
		let newPhotos = [...resource.photo];
		newPhotos.splice(index, 1);
		if (newPhotos.length == 0) newPhotos.push(new Attachment({}));
		modifyResource("photo", newPhotos);
	};
	const addPhoto = () => {
		let newPhotos = [...resource.photo];
		newPhotos.push(new Attachment({}));
		modifyResource("photo", newPhotos);
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
				attributeLink={"https://www.hl7.org/fhir/patient.html#resource"}
				inputComponents={
					<DisabledTextField fullWidth disabled placeholder="Patient" />
				}
				renderKey={"Patient"}
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
				attributeDescription="The names associated with this patient"
				renderKey={resource ? resource.name : null}
				attributeLink={"https://www.hl7.org/fhir/datatypes.html#HumanName"}
				inputComponents={
					<ExtendableComponent
						title="Add a name"
						handleExtend={() => {
							addName();
						}}
					>
						{resource
							? resource.name
								? resource.name
										.map((name, index) => {
											return {
												name: name,
												key: name.internalReactID,
												index: index,
											};
										})
										.map((name) => {
											return (
												<Box key={name.key}>
													<DeleteableComponent
														title="Delete this name"
														handleDelete={() => {
															handleDeleteName(name.index);
														}}
														disabled={
															resource.name.length == 1 &&
															isObjectEmptyRecursive(resource.name)
														}
													>
														<Subcomponent>
															<HumanNameInput
																name={name.name}
																changeSingleName={changeSingleName}
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
				attributeName="Birthdate"
				attributeDescription="The date of birth for the individual"
				attributeLink={"https://www.hl7.org/fhir/datatypes.html#date"}
				inputComponents={
					<DateTabs
						value={resource ? resource.birthDate || null : null}
						//value={resource.birthDate}
						typeOfDate="date"
						changeDateTime={changeBirthDate}
						label="Birthdate"
						disableFuture
						width={window.DEFAULTDATETABSWIDTH}
					/>
				}
				renderKey={resource ? resource.birthDate : null}
			/>
			<AttributeBlock
				attributeName="Gender"
				attributeDescription="The patients gender"
				attributeLink={
					"https://www.hl7.org/fhir/patient-definitions.html#Patient.gender"
				}
				inputComponents={
					<GenderInput
						gender={resource ? resource.gender : null}
						changeGender={changeGender}
					/>
				}
				renderKey={resource ? resource.gender : null}
			/>
			<AttributeBlock
				attributeName="Photo"
				attributeDescription="Images of the patient"
				renderKey={resource ? resource.photo : null}
				attributeLink={
					"https://www.hl7.org/fhir/patient-definitions.html#Patient.photo"
				}
				inputComponents={
					<ExtendableComponent
						title="Add a photo"
						handleExtend={() => {
							addPhoto();
						}}
					>
						{resource
							? resource.photo
								? resource.photo
										.map((singlePhoto, index) => {
											return {
												singlePhoto: singlePhoto,
												key: singlePhoto.internalReactID,
												index: index,
											};
										})
										.map((singlePhoto) => {
											return (
												<Box key={singlePhoto.key}>
													<DeleteableComponent
														title="Delete this photo"
														handleDelete={() => {
															handleDeletePhoto(singlePhoto.index);
														}}
														disabled={
															resource.photo.length == 1 &&
															isObjectEmptyRecursive(resource.photo)
														}
													>
														<Subcomponent>
															<AttachmentInput
																attachment={singlePhoto.singlePhoto}
																changeAttachment={changePhoto}
																photoSizeSum={totalPhotoSize}
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
				attributeName="Active"
				attributeDescription="Indicates whether this patient's record is in active use"
				attributeLink={
					"https://www.hl7.org/fhir/patient-definitions.html#Patient.active"
				}
				inputComponents={
					<BooleanInput
						title="Active"
						checked={
							resource ? (resource.active ? resource.active : false) : false
						} // mepdplum does not filter strings for boolean inputs -> might return "blablabla"
						changeChecked={changeActive}
					/>
				}
				renderKey={resource ? resource.active : null}
			/>

			<AttributeBlock
				attributeName="Deceased"
				attributeDescription="Indicates if (and/or when) the individual is deceased."
				attributeLink={
					"https://www.hl7.org/fhir/patient-definitions.html#Patient.deceased_x_"
				}
				renderKey={
					resource
						? JSON.stringify({
								bool: resource.deceasedBoolean || null,
								time: resource.deceasedDateTime || null,
						  })
						: null
				}
				inputComponents={
					<DeceasedInput
						deceasedBoolean={resource ? resource.deceasedBoolean : null}
						deceasedDateTime={resource ? resource.deceasedDateTime : null}
						changeDeceasedBoolean={changeDeceasedBoolean}
						changeDeceasedDateTime={changeDeceasedDateTime}
					/>
				}
			/>
			<AttributeBlock
				attributeName="Address"
				attributeDescription="Addresses for the individual"
				renderKey={resource ? resource.address : null}
				attributeLink={"https://www.hl7.org/fhir/datatypes.html#Address"}
				inputComponents={
					<>
						<ExtendableComponent
							title="Add Address"
							handleExtend={() => {
								addAddress();
							}}
						>
							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
									gap: "55px",
									width: "100%",
								}}
							>
								{resource
									? resource.address
										? resource.address
												.map((singleAddress, index) => {
													return {
														singleAddress: singleAddress,
														key: singleAddress.internalReactID,
														index: index,
													};
												})
												.map((singleAddress) => {
													return (
														<Box key={singleAddress.key}>
															<DeleteableComponent
																title="Delete this address"
																handleDelete={() => {
																	handleDeleteAddress(singleAddress.index);
																}}
																disabled={
																	resource.address.length == 1 &&
																	isObjectEmptyRecursive(resource.address)
																}
															>
																<Subcomponent>
																	<AddressInput
																		address={singleAddress.singleAddress}
																		changeSingleAddress={changeSingleAddress}
																	/>
																</Subcomponent>
															</DeleteableComponent>
														</Box>
													);
												})
										: null
									: null}
							</Box>
						</ExtendableComponent>
					</>
				}
			/>
			<AttributeBlock
				attributeName="Identifier"
				attributeDescription="Identifiers for this patient."
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
				attributeName="Telecom"
				attributeDescription="A contact detail for the individual"
				renderKey={resource ? resource.telecom : null}
				attributeLink={"https://www.hl7.org/fhir/datatypes.html#ContactPoint"}
				inputComponents={
					<>
						<ExtendableComponent
							title="Add telecom"
							handleExtend={() => {
								addTelecom();
							}}
						>
							{resource
								? resource.telecom
									? resource.telecom
											.map((singleTelecom, index) => {
												return {
													singleTelecom: singleTelecom,
													key: singleTelecom.internalReactID,
													index: index,
												};
											})
											.map((singleTelecom) => {
												return (
													<Box key={singleTelecom.key}>
														<DeleteableComponent
															title="Delete this telecom"
															handleDelete={() => {
																handleDeleteTelecom(singleTelecom.index);
															}}
															disabled={
																resource.telecom.length == 1 &&
																isObjectEmptyRecursive(resource.telecom)
															}
														>
															<Subcomponent>
																<TelecomInput
																	telecom={singleTelecom.singleTelecom}
																	changeTelecom={changeTelecom}
																/>
															</Subcomponent>
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
				attributeName="Marital status"
				attributeDescription="The marital (civil) status of a patient"
				attributeLink={
					"https://www.hl7.org/fhir/datatypes.html#CodeableConcept"
				}
				inputComponents={
					<CodeableConeptInput
						codeableConcept={resource ? resource.maritalStatus : null}
						changeCodeableConcept={changeMaritalStatus}
					/>
				}
				renderKey={resource ? resource.maritalStatus : null}
			/>
			<AttributeBlock
				attributeName="Multiple birth"
				attributeDescription="Whether patient is part of a multiple birth. A number indicates the birth number in the sequence."
				attributeLink={
					"https://www.hl7.org/fhir/patient-definitions.html#Patient.multipleBirth_x_"
				}
				renderKey={
					resource
						? JSON.stringify({
								bool: resource.multipleBirthBoolean || null,
								integer: resource.multipleBirthInteger || null,
						  })
						: null
				}
				inputComponents={
					<MultipleBirthInput
						multipleBirthBoolean={
							resource ? resource.multipleBirthBoolean : null
						}
						multipleBirthInteger={
							resource ? resource.multipleBirthInteger : null
						}
						changeMultipleBirthBoolean={changeMultipleBirthBoolean}
						changeMultipleBirthInteger={changeMultipleBirthInteger}
					/>
				}
			/>

			<AttributeBlock
				attributeName="Communication"
				attributeDescription="Languages which may be used to communicate with the patient about his or her health"
				attributeLink={
					"https://www.hl7.org/fhir/patient-definitions.html#Patient.communication"
				}
				renderKey={resource ? resource.communication : null}
				inputComponents={
					<>
						<ExtendableComponent
							title="Add Communication"
							handleExtend={() => {
								modifyResource("communication", [
									...resource.communication,
									new Communication({}),
								]);
							}}
							gap="5rem"
						>
							{resource
								? resource.communication
									? resource.communication
											.map((singleCom, index) => {
												return {
													singleCom: singleCom,
													key: singleCom.internalReactID,
													index: index,
												};
											})
											.map((singleCom) => {
												return (
													<Box key={singleCom.key}>
														<DeleteableComponent
															title="Delete this Communication"
															handleDelete={() => {
																handleDeleteCommunication(singleCom.index);
															}}
															disabled={
																resource.communication.length == 1 &&
																isObjectEmptyRecursive(resource.communication)
															}
														>
															<Subcomponent outer={true}>
																<CommunicationInput
																	communication={singleCom.singleCom}
																	changeCommunication={changeCommunication}
																/>
															</Subcomponent>
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
				attributeName="General Practitioner"
				attributeDescription="Patient's nominated primary care provider(s)"
				attributeLink={"https://www.hl7.org/fhir/references.html#Reference"}
				renderKey={resource ? resource.generalPractitioner : null}
				inputComponents={
					<ExtendableComponent
						title="Add a general practitioner"
						handleExtend={() => {
							addGeneralPractitioner();
						}}
					>
						{resource
							? resource.generalPractitioner
								? resource.generalPractitioner
										.map((singleGP, index) => {
											return {
												singleGP: singleGP,
												key: singleGP.internalReactID,
												index: index,
											};
										})
										.map((singleGP) => {
											return (
												<Box key={singleGP.key}>
													<DeleteableComponent
														title="Delete this general Practitioner"
														handleDelete={() => {
															handleDeleteGeneralPractitioner(singleGP.index);
														}}
														disabled={
															resource.generalPractitioner.length == 1 &&
															isObjectEmptyRecursive(
																resource.generalPractitioner
															)
														}
													>
														<Subcomponent>
															<ReferenceInput
																reference={singleGP.singleGP}
																changeReference={
																	handleChangeGeneralPracticioner
																}
																referenceOptions={{
																	Organization: {
																		displayAttribute: "name",
																		paramsAndModifiers: ["name:contains"],
																	},
																	Practitioner: {
																		//displayAttribute: "name",
																		calculateDisplayAttribute: (
																			jsonResource
																		) => {
																			let s = "";
																			if (jsonResource.name) {
																				jsonResource.name.forEach(
																					(singleName) => {
																						s +=
																							singleName.given.join(" ") +
																							+(singleName.family
																								? ", " + singleName.family
																								: "");
																						s += ";";
																					}
																				);
																			} else {
																				s = "(Unnamed)";
																			}
																			return s;
																		},
																		paramsAndModifiers: ["name:contains"],
																	},
																	PractitionerRole: {
																		displayAttribute: "",
																		paramsAndModifiers: ["_id:text-advanced"],
																	},
																}}
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
				attributeName="Managing Organization"
				attributeDescription="Organization that is the custodian of the patient record"
				attributeLink={"https://www.hl7.org/fhir/references.html#Reference"}
				renderKey={resource ? resource.managingOrganization : null}
				inputComponents={
					<ReferenceInput
						reference={resource.managingOrganization}
						changeReference={handleChangeManagingOrganization}
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
				attributeName="Link"
				attributeDescription="Links to a Patient or RelatedPerson resource that concern the same actual individual"
				renderKey={resource ? resource.link : null}
				attributeLink={
					"https://www.hl7.org/fhir/patient-definitions.html#Patient.link"
				}
				inputComponents={
					<ExtendableComponent
						title="Add a Link"
						handleExtend={() => {
							addLink();
						}}
					>
						{resource
							? resource.link
								? resource.link
										.map((singleLink, index) => {
											return {
												singleLink: singleLink,
												key: singleLink.internalReactID,
												index: index,
											};
										})
										.map((singleLink) => {
											return (
												<Box key={singleLink.key}>
													<DeleteableComponent
														title="Delete this link"
														handleDelete={() => {
															handleDeleteLink(singleLink.index);
														}}
														disabled={
															resource.link.length == 1 &&
															isObjectEmptyRecursive(resource.link)
														}
													>
														<Subcomponent>
															<LinkInput
																link={singleLink.singleLink}
																changeLink={changeLink}
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
				attributeName="Contact"
				attributeDescription="Contact parties (e.g. guardian, partner, friend) for the patient"
				attributeLink={
					"https://www.hl7.org/fhir/patient-definitions.html#Patient.contact"
				}
				renderKey={resource ? resource.contact : null}
				inputComponents={
					<>
						<ExtendableComponent
							title="Add Contact"
							handleExtend={() => {
								modifyResource("contact", [
									...resource.contact,
									new Contact({}),
								]);
							}}
							gap="5rem"
						>
							{resource
								? resource.contact
									? resource.contact
											.map((singleContact, index) => {
												return {
													singleContact: singleContact,
													key: singleContact.internalReactID,
													index: index,
												};
											})
											.map((singleContact) => {
												return (
													<Box key={singleContact.key}>
														<DeleteableComponent
															title="Delete this contact"
															handleDelete={() => {
																handleDeleteContact(singleContact.index);
															}}
															disabled={
																resource.contact.length == 1 &&
																isObjectEmptyRecursive(resource.contact)
															}
														>
															<Subcomponent>
																<ContactInput
																	contact={singleContact.singleContact}
																	changeContact={changeContact}
																/>
															</Subcomponent>
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
		</Box>
	);
};

export default PatientInput;
