import { medplum } from "../index";
import { Buffer } from "buffer";
import { v4 as uuidv4 } from "uuid";
import { Patient } from "../classes/resourceTypes/Patient";
import { queryError, timeoutError, tokenError, updateError } from "./errors";

const getResultCount = async (url) => {
	// Preflight method to get number of results (without actual resources). Can be used for better pagination handling.
	const headers = new Headers();
	/* headers.set("Authorization", "Bearer " + token); */
	return await fetch(url, { method: "GET", headers: headers })
		.then((response) => {
			if (!response.ok) {
				return null;
			}
			return response.json();
		})
		.then((data) => {
			return data.total ? data.total : null;
		});
};

export default async function queryFHIR(resources, searchString, limit) {
	let r = apiTimeout(async () => {
		/* let token;
		token = await getToken(); */

		var results = {};
		resources.forEach((r) => {
			results[r] = [];
		});

		for (const resource of [Patient]) {
			let resultCountPreflight = await getResultCount(
				`${process.env.REACT_APP_FHIR_BASE}/${resource.name}?_content=${searchString}&_summary=count`
			);
			let count;
			if (!resultCountPreflight) count = limit;
			else if (resultCountPreflight > 3000) {
				count = Math.floor(resultCountPreflight / 4);
			} else if (resultCountPreflight > 900) {
				count = Math.floor(resultCountPreflight / 3);
			} else if (resultCountPreflight > 400) {
				count = Math.floor(resultCountPreflight / 2);
			} else {
				count = resultCountPreflight;
			}
			let nextPageLink = "";
			do {
				// hapi test server doesnt support maxresults, check in IBM
				/* const searchUrl = `${process.env.REACT_APP_FHIR_BASE}/${resource.name}?_content=${searchString}&_maxresults=5`; */
				const searchUrl = nextPageLink
					? nextPageLink
					: `${process.env.REACT_APP_FHIR_BASE}/${
							resource.name
					  }?_content=${searchString}&_count=${
							!isNaN(count) && count > 0 ? count : ""
					  }`;
				const headers = new Headers();
				var errorMessages;
				/* headers.set("Authorization", "Bearer " + token); */
				await fetch(searchUrl, { method: "GET", headers: headers })
					.then((response) => {
						if (!response.ok) {
							//handleErrorResponse(response)
						}
						return response.json();
					})
					.then((data) => {
						if (data["resourceType"] == "OperationOutcome") {
							errorMessages = data.issue.map((element) => {
								return element.details.text;
							});
						}
						if (errorMessages) {
							throw new queryError(
								"There was an error fetching data." +
									"\nFHIR issues: " +
									errorMessages,
								errorMessages
							);
						}
						const pageEntries = data.entry
							? data.entry.map(
									(element) => new resource({ ...element.resource })
							  )
							: [];
						results[resource.name].push(...pageEntries);
						if (!limit || results[resource.name].length < limit) {
							if (data.link) {
								let next = data.link.filter((item) => item.relation == "next");
								console.log("here in datalink: ", data);
								console.log("here next is: ", next);
								nextPageLink = next.length > 0 ? next[0].url : "";
								console.log("here nextplagelinkg is: ", nextPageLink);
							} else nextPageLink = "";
						} else nextPageLink = "";
					});
			} while (nextPageLink);
			if (limit)
				results[resource.name] = results[resource.name].slice(0, limit);
		}
		return results;
	});
	return r;
}
export async function createFHIRResource(resourceType, newResource) {
	let r = apiTimeout(async () => {
		/* let token;
		try {
			token = await getToken();
		} catch (e) {
			throw new tokenError(
				"Failed to update FHIR resource because of token error"
			);
		} */
		const searchUrl = `${process.env.REACT_APP_FHIR_BASE}/${resourceType}`;
		const headers = new Headers();
		/* headers.set("Authorization", "Bearer " + token); */
		headers.set("Content-Type", "application/fhir+json");
		let errorMessages;
		const updateResult = await fetch(searchUrl, {
			method: "POST",
			headers: headers,
			body: newResource.toFHIRJson(),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data["resourceType"] == "OperationOutcome") {
					alert("OPoutcome");
					errorMessages = data.issue.map((element) => {
						return element.details.text;
					});
				}
				if (errorMessages) {
					throw new queryError(
						"There was an error updating data." +
							"\nFHIR issues: " +
							errorMessages,
						errorMessages
					);
				}
				return data;
			});
		return updateResult;
	});
	return r;
}
export async function updateFHIRResource(
	resourceType,
	oldResource,
	updatedResource
) {
	console.log("updating resource: ", updatedResource);
	console.log("fhirified resource: ", updatedResource.toFHIRJson());
	let r = apiTimeout(async () => {
		/* let token;
		try {
			token = await getToken();
		} catch (e) {
			alert("caught tokenerror");
			throw new tokenError(
				"Failed to update FHIR resource because of token error"
			);
		} */
		const searchUrl = `${process.env.REACT_APP_FHIR_BASE}/${resourceType}?${oldResource.id}`;
		const headers = new Headers();
		/* headers.set("Authorization", "Bearer " + token); */
		headers.set("Content-Type", "application/fhir+json");
		let errorMessages;
		const updateResult = await fetch(searchUrl, {
			method: "PUT",
			headers: headers,
			body: updatedResource.toFHIRJson(),
		})
			.then((response) => {
				if (!response.ok) {
					if (response.status == 400)
						throw new updateError(
							"Resource could not be parsed or failed FHIR validation rules."
						);
					if (response.status == 401)
						throw new updateError(
							"Authorization failed. You might need to login again."
						);
					if (response.status == 404)
						throw new updateError(
							"Resource not found on the server. Maybe it was deleted by someone else while you were editing it."
						);
					if (response.status == 405)
						throw new updateError(
							"The server does not allow client defined ids. Please contact the FHIR servers administrator to configure 'Update as Create'."
						);
					if (response.status == 409 || response.status == 412)
						throw new updateError(
							"Version Conflict. Someone else might have edited the resource in the meanwhile."
						);
					if (response.status == 422)
						throw new updateError(
							"The proposed resource violated applicable FHIR profiles or server business rules."
						);
				}
				return response.json();
			})
			.then((data) => {
				if (data["resourceType"] == "OperationOutcome") {
					alert("OPoutcome");
					errorMessages = data.issue.map((element) => {
						return element.details.text;
					});
				}
				if (errorMessages) {
					throw new queryError(
						"There was an error updating data." +
							"\nFHIR issues: " +
							errorMessages,
						errorMessages
					);
				}
				return data;
			});
		return updateResult;
	});
	return r;
}

export const deleteResources = async (ids, resourceType) => {
	let r = apiTimeout(async () => {
		/* let token;
		try {
			token = await getToken();
		} catch (e) {
			throw new tokenError(
				"Failed to update FHIR resource because of token error. Is the server online?"
			);
		} */
		const results = await Promise.all(
			ids.map(async (id) => {
				const searchUrl = `${process.env.REACT_APP_FHIR_BASE}/${resourceType}/${id}`;
				const headers = new Headers();
				/* headers.set("Authorization", "Bearer " + token); */
				headers.set("Content-Type", "application/fhir+json");

				await fetch(searchUrl, {
					method: "DELETE",
					headers: headers,
				})
					.then((response) => {
						if (!response.ok) {
							if (response.status === 405)
								throw new updateError(
									"Deleting for resource " +
										String(id) +
										" not allowed. Is there a server-side policy that prevents deletion of particular resources?"
								);
							else if (response.status === 409)
								throw new updateError(
									"Deleting for resource " +
										String(id) +
										" not allowed. There seems to be a conflict."
								);
							else if (response.status === 410)
								throw new updateError(
									"Deleting for resource " +
										String(id) +
										" not possible. It does not exist on the server. Maybe it was deleted by another user in the meantime."
								);
							else {
								throw new updateError(
									"Deleting for resource " +
										String(id) +
										" not allowed. Status code: " +
										String(response.status) +
										". Refer to the FHIR specification for what might have gone wrong."
								);
							}
						}
						return response.json();
					})
					.then((data) => {
						let badSeverities = ["fatal", "error", "warning"];
						let errorMessages;
						if (data["resourceType"] == "OperationOutcome") {
							errorMessages = data.issue.filter((element) =>
								badSeverities.includes(element.severity)
							);
							errorMessages = errorMessages.map(
								(element) => element.details.text
							);
						}
						if (errorMessages.length > 0) {
							throw new updateError("\nFHIR issues: " + errorMessages);
						}
						return data;
					});
			})
		);
	});
	return r;
};

export const getToken = () => {
	const tokenHeaders = new Headers();
	tokenHeaders.set("Content-Type", "application/x-www-form-urlencoded");
	const urlParams = new URLSearchParams();
	urlParams.append("grant_type", "client_credentials");
	urlParams.append("client_id", "5b582c95-65f8-46d1-9ce4-0591846140b5");
	urlParams.append("client_secret", process.env.REACT_APP_CLIENT_SECRET);
	return fetch(`${process.env.REACT_APP_FHIR_BASE}/oauth2/token`, {
		method: "POST",
		headers: tokenHeaders,
		body: urlParams,
	})
		.then((response) => {
			if (!response.ok)
				throw new tokenError(
					"There was an authorization issue. Are you logged in?"
				);
			return response.json();
		})
		.then((data) => {
			return data.access_token;
		});
};

export const allResources = [
	"Binary",
	"Bundle",
	"CapabilityStatement",
	"CodeSystem",
	"Observation",
	"OperationDefinition",
	"OperationOutcome",
	"Parameters",
	"Patient",
	"StructureDefinition",
	"ValueSet",
];

export const apiTimeout = async (apiCall) => {
	let timeoutId;
	let timeoutPromise = new Promise(async (resolve, reject) => {
		timeoutId = setTimeout(() => {
			clearTimeout(timeoutId);
			reject(
				new timeoutError(
					"Request taking very long. Try limiting the input or check if the server is online."
				)
			);
		}, 60000);
	});

	const apiCallPromise = apiCall();

	return Promise.race([apiCallPromise, timeoutPromise]).finally(() => {
		clearTimeout(timeoutId);
	});
};

export async function searchReference(resourcetype, paramsAndModifiers) {
	// This function differs from the normal queryFHIR function in that it does deserialize the results, but keeps it in JSON. This is because
	// the referenced types are not (yet) represented in this application (for now only "Patient").
	/* let token;
	token = await getToken(); */

	// This functionality will be added if the IBM server supports the _filter option to allow logical OR on multiple element types, not only on the values
	// of a single element Type.
	//const searchUrl = `${process.env.REACT_APP_FHIR_BASE}/fhir/R4/${resourcetype}?${paramsAndModifiers}`;
	const searchUrl = `${process.env.REACT_APP_FHIR_BASE}/${resourcetype}?`;

	const headers = new Headers();
	/* headers.set("Authorization", "Bearer " + token); */

	var errorMessages;
	let results = await fetch(searchUrl, { method: "GET", headers: headers })
		.then((response) => {
			if (!response.ok) {
				console.log(response);
			}
			return response.json();
		})
		.then((data) => {
			if (data["resourceType"] == "OperationOutcome") {
				errorMessages = data.issue.map((element) => {
					return element.details.text;
				});
			}
			if (errorMessages) {
				throw new queryError(
					"There was an error fetching data." +
						"\nFHIR issues: " +
						errorMessages,
					errorMessages
				);
			}

			return data.entry.map((element) => {
				return { ...element.resource };
			});
		});
	return results;
}

export async function getAttachment(url) {
	// This function differs from the normal queryFHIR function in that it does deserialize the results, but keeps it in JSON. This is because
	// the referenced types are not (yet) represented in this application (for now only "Patient").
	let token;
	token = await getToken();
	// This functionality will be added if the IBM server supports the _filter option to allow logical OR on multiple element types, not only on the values
	// of a single element Type.
	//const searchUrl = `${process.env.REACT_APP_FHIR_BASE}/fhir/R4/${resourcetype}?${paramsAndModifiers}`;
	const searchUrl = url;
	const headers = new Headers();
	/* headers.set("Authorization", "Bearer " + token); */
	return fetch(searchUrl, { method: "GET", headers: headers });
}
