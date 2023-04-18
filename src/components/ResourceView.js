import React from "react";
import { Box } from "@mui/system";
import { FhirResource, fhirVersions } from "fhir-react";

const ResourceView = () => {
	return (
		<FhirResource
			fhirResource={`{
  "resourceType": "Patient",
  "active": true,
  "name": [
    {
      "given": [
        "Peter"
      ],
      "prefix": [
        "Mr"
      ],
      "family": "Bean"
    }
  ],
  "gender": "male",
  "birthDate": "2023-01-13",
  "deceasedBoolean": false,
  "maritalStatus": {
    "coding": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
        "code": "D",
        "display": "Divorced"
      }
    ]
  },
  "id": "ce6502cc-131d-4f5b-9228-9db2d472bcf4",
  "meta": {
    "versionId": "3ad2ae14-6735-437e-b13f-ede61664b00f",
    "lastUpdated": "2023-01-25T10:19:36.314Z",
    "author": {
      "reference": "Practitioner/d6ee39ab-d2a0-4b1e-9075-bbe4a8021f45",
      "display": "Vincent Beyer"
    },
    "project": "0db0af3c-4d30-4dcd-b0b7-9b70f753727c",
    "compartment": [
      {
        "reference": "Project/0db0af3c-4d30-4dcd-b0b7-9b70f753727c"
      },
      {
        "reference": "Patient/ce6502cc-131d-4f5b-9228-9db2d472bcf4",
        "display": "Mr Peter Bean"
      }
    ]
  }
}`}
			fhirVersion={fhirVersions.R4}
		/>
	);
};

export default ResourceView;
