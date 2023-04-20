import React, { memo } from "react";
import { Box } from "@mui/system";
import { Divider, TextField, Tooltip, Typography } from "@mui/material";
import HumanNameInput from "../elementInputs/HumanNameInput";
import { styled } from "@mui/material/styles";
import CodeInput from "../primitiveInputs/CodeInput";
import GenderInput from "../elementInputs/GenderInput";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Button, IconButton } from "@mui/material";
import { DisabledTextField } from "../styledComponents/DisabledTextfield";
import { useState } from "react";
import { useImmer } from "use-immer";
import { HumanName } from "../../classes/dataTypes/HumanName";
import BooleanInput from "../primitiveInputs/BooleanInput";
import dayjs from "dayjs";

import AttributeBlock from "../common/AttributeBlock";
import DateTimeInput from "../primitiveInputs/DateTimeInput";
import PartialDateTimeInput from "../primitiveInputs/PartialDateTimeInput";
import DateTabs from "../common/DateTabs";
import { PartialDateTime } from "../../classes/dataTypes/PartialDateTime";
import { flushSync } from "react-dom";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useEffect } from "react";
import { useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import IdentifierInput from "../elementInputs/IdentifierInput";
import { Identifier } from "../../classes/dataTypes/Identifier";
import Subcomponent from "../common/Subcomponent";
import DeleteableComponent from "../common/DeleteableComponent";
import ExtendableComponent from "../common/ExtendableComponent";
import { isObjectEmptyRecursive } from "../../utilities/fhirify";
import TelecomInput from "../elementInputs/TelecomInput";
import { ContactPoint } from "../../classes/dataTypes/ContactPoint";
import testfield from "../testfield";
import Testfield from "../testfield";
import DeceasedInput from "../elementInputs/DeceasedInput";
import AddressInput from "../elementInputs/AddressInput";
import Address from "../../classes/dataTypes/Address";
import CodeableConeptInput from "../elementInputs/CodeableConeptInput";
import MultipleBirthInput from "../elementInputs/MultipleBirthInput";
import ContactInput from "../elementInputs/ContactInput";
import Contact from "../../classes/dataTypes/Contact";
import Communication from "../../classes/dataTypes/Communication";
import CommunicationInput from "../elementInputs/CommunicationInput";
import ReferenceInput from "../elementInputs/ReferenceInput";
import Reference from "../../classes/specialTypes/Reference";
import LinkInput from "../elementInputs/LinkInput";
import Link from "../../classes/dataTypes/Link";
import AttachmentInput from "../elementInputs/AttachmentInput";

const IterableElementClassList = {
	telecom: ContactPoint,
	identifier: Identifier,
	name: HumanName,
};

const PatientInput = ({ resource, modifyResource }) => {
	useEffect(() => {
		console.log("Patien rendered: ", resource);
	}, [resource]);

	const cloneElementList = (iterableElementType) => {
		let newElements = [];
		if (!resource || !resource[iterableElementType]) return [];
		for (let i = 0; i < resource[iterableElementType].length; i++) {
			let x = new IterableElementClassList[iterableElementType](
				structuredClone(resource[iterableElementType][i])
			);
			x.internalReactID = resource[iterableElementType][i].internalReactID;
			newElements.push(x);
		}
		return newElements;
	};

	const addName = () => {
		/* let newNames = cloneElementList("name"); */
		let newNames = [...resource.name];

		newNames.push(new HumanName({}));
		modifyResource("name", newNames);
	};

	const handleDeleteName = (index) => {
		/* let newNames = cloneElementList("name"); */
		let newNames = [...resource.name];
		newNames.splice(index, 1);
		if (newNames.length == 0) newNames.push(new HumanName({}));
		modifyResource("name", newNames);
	};

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
	return (
		<Box>
			<AttributeBlock
				attributeName="Resource Type"
				attributeDescription="The Type of this resource"
				inputComponents={
					<DisabledTextField fullWidth disabled placeholder="Patient" />
				}
				renderKey={"Patient"}
			/>
			<AttributeBlock
				attributeName="ID"
				attributeDescription="The unique ID for this resource"
				inputComponents={
					<DisabledTextField
						fullWidth
						disabled
						placeholder={resource ? resource.id : null}
					/>
				}
				renderKey={resource ? resource.id : null}
			/>
			<Button
				onClick={() => {
					console.log(resource);
				}}
			>
				click
			</Button>

			<AttributeBlock
				attributeName="Identifier"
				attributeDescription="Identifiers for this patient."
				renderKey={resource ? resource.identifier : null}
				inputComponents={
					<ExtendableComponent
						title="Add identifier"
						handleExtend={() => {
							addIdentifier();
						}}
					>
						{resource
							? resource.identifier
								? resource.identifier
										.map((singleIdentifier, index) => {
											return {
												idf: singleIdentifier,
												key: singleIdentifier.internalReactID,
												index: index,
											};
										})
										.map((singleIdentifierObj) => {
											return (
												<Box key={singleIdentifierObj.key}>
													<DeleteableComponent
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
															<IdentifierInput
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
				attributeName="Name"
				attributeDescription="The names associated with this patient"
				renderKey={resource ? resource.name : null}
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
				attributeName="Gender"
				attributeDescription="The patients gender"
				inputComponents={
					<GenderInput
						gender={resource ? resource.gender : null}
						changeGender={changeGender}
					/>
				}
				renderKey={resource ? resource.gender : null}
			/>
			<AttributeBlock
				attributeName="Active"
				attributeDescription="Indicates whether this patient's record is in active use"
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
				attributeName="Birthdate"
				attributeDescription="The date of birth for the individual"
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
				attributeName="Deceased"
				attributeDescription="Indicates if (and/or when) the individual is deceased."
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
				attributeName="Telecom"
				attributeDescription="A contact detail for the individual"
				renderKey={resource ? resource.telecom : null}
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
																alert("TODO: Change index to key!");
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
				attributeName="Address"
				attributeDescription="Addresses for the individual"
				renderKey={resource ? resource.address : null}
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
				attributeName="Marital status"
				attributeDescription="The marital (civil) status of a patient"
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
				attributeDescription="Whether patient is part of a multiple birth."
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
				attributeName="Contact"
				attributeDescription="Contact parties (e.g. guardian, partner, friend) for the patient"
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
			<AttributeBlock
				attributeName="Communication"
				attributeDescription="Languages which may be used to communicate with the patient about his or her health"
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
				attributeName="Attachment"
				attributeDescription="Images of the patient"
				renderKey={resource ? resource.photo : null}
				inputComponents={
					<ExtendableComponent
						title="Add a photo"
						handleExtend={() => {
							alert("todo");
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
															/* handleDeleteLink(singleLink.index); */
															alert("TODO");
														}}
														disabled={
															resource.photo.length == 1 &&
															isObjectEmptyRecursive(resource.photo)
														}
													>
														<Subcomponent>
															<AttachmentInput
																attachment={singlePhoto.singlePhoto}
																changeAttachment={() => {}}
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

export default PatientInput;
