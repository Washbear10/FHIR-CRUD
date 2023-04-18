import { ContactPoint } from "../classes/dataTypes/ContactPoint";
import { HumanName } from "../classes/dataTypes/HumanName";
import { Identifier } from "../classes/dataTypes/Identifier";
import { Patient } from "../classes/resourceTypes/Patient";
import PatientInput from "../components/resourceInputs/PatientInput";

export const constructList = {
	Patient: Patient,
};

export const dialogList = {
	Patient: PatientInput,
};
