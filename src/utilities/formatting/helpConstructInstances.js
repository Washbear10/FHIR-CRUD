import { Organization } from "../../classes/resourceTypes/Organization";
import { Patient } from "../../classes/resourceTypes/Patient";
import PatientInput from "../../components/resourceInputs/PatientInput";

// Lookup table to use when trying to get the class by dynamically received string.
export const constructList = {
	Patient: Patient,
	Organization: Organization,
};

export const dialogList = {
	Patient: PatientInput,
};
