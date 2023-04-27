import { Patient } from "../../classes/resourceTypes/Patient";
import { getBasicAuthCreds } from "../authentication/basicAuth";
import {
	authenticationError,
	queryError,
	timeoutError,
	updateError,
} from "./errors";

export async function testBasicAuth(authenticationValue) {
	async function innerTestBasicAuth() {
		const headers = new Headers();
		const searchUrl = `${process.env.REACT_APP_FHIRBASE}`;
		headers.set("Authorization", "Basic " + authenticationValue);
		return await fetch(searchUrl, { method: "GET", headers: headers }).then(
			(response) => {
				if (response.status === 401) {
					return "Unauthenticated";
				} else if (!response.ok) {
					return "Error";
				} else {
					return "Ok";
				}
			}
		);
	}
	let r = apiTimeout(innerTestBasicAuth, 5000);
	return r;
}

async function getResultCount(url) {
	// Preflight method to get number of results (without actual resources). Can be used for better pagination handling.
	const headers = new Headers();
	const authenticationValue = getBasicAuthCreds();
	headers.set("Authorization", "Basic " + authenticationValue);
	let errorMessages;
	return await fetch(url, { method: "GET", headers: headers })
		.then(async (response) => {
			if (response.status == 401)
				throw new authenticationError(
					"Authentication failed. You might need to login again."
				);

			if (!response.ok) {
				return null;
			}
			return response.json();
		})
		.then((data) => {
			return data.total ? data.total : null;
		});
}

export default async function queryFHIR(resources, searchString, limit) {
	let r = apiTimeout(async () => {
		var results = {};
		resources.forEach((r) => {
			results[r] = [];
		});

		// Since this application only implements the Patient input, only Patient resources can be queried.
		// When functionality for other Resources are added, some minor changes will have to be made to this function (mainly regarding search parameters.)
		for (const resource of [Patient]) {
			const headers = new Headers();
			const authenticationValue = getBasicAuthCreds();
			headers.set("Authorization", "Basic " + authenticationValue);
			let count = 100;

			let nextPageLink = "";
			do {
				const searchUrl = nextPageLink
					? nextPageLink
					: `${process.env.REACT_APP_FHIRBASE}/${resource.getResourceName}?${
							searchString ? "name:contains=" + searchString + "&" : ""
					  }_count=${count}`;
				let errorMessages;
				/* headers.set("Authorization", "Bearer " + token); */
				await fetch(searchUrl, { method: "GET", headers: headers })
					.then((response) => {
						if (response.status == 401) {
							alert("here query ");
							throw new authenticationError(
								"Authentication failed. You might need to login again."
							);
						}

						if (response.status == 400) {
							try {
								let jsonResponse = response.json();
								errorMessages = jsonResponse.issue
									.filter((issue) => issue["severity"] == "error")
									.map((issue) => {
										let s = "";
										if (issue.expression)
											s += "Issue in " + issue.expression.join(",") + ": ";
										if (issue.details) s += issue.details.text;
									});
							} catch (e) {
								console.log("caught error trying to decode issues: ", e);
							}
							throw new updateError(errorMessages.join("\n"));
						}
						return response.json();
					})
					.then((data) => {
						if (data["resourceType"] == "OperationOutcome") {
							errorMessages = data.issue
								.filter((issue) => issue["severity"] == "error")
								.map((element) => {
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
		console.log("Query: ", results);
		return results;
	}, 40000);
	return r;
}
export async function createFHIRResource(resourceType, newResource) {
	let r = apiTimeout(async () => {
		const searchUrl = `${process.env.REACT_APP_FHIRBASE}/${resourceType}`;
		const headers = new Headers();
		const authenticationValue = getBasicAuthCreds();
		headers.set("Authorization", "Basic " + authenticationValue);
		headers.set("Content-Type", "application/fhir+json");
		let errorMessages;
		const updateResult = await fetch(searchUrl, {
			method: "POST",
			headers: headers,
			body: newResource.toFHIRJson(),
		}).then((response) => {
			if (response.status == 401)
				throw new authenticationError(
					"Authentication failed. You might need to login again."
				);
			if (response.status == 400) {
				try {
					let jsonResponse = response.json();
					errorMessages = jsonResponse.issue
						.filter((issue) => issue["severity"] == "error")
						.map((issue) => {
							let s = "";
							if (issue.expression)
								s += "Issue in " + issue.expression.join(",") + ": ";
							if (issue.details) s += issue.details.text;
						});
				} catch (e) {
					console.log("caught error trying to decode issues: ", e);
				}
				throw new updateError(errorMessages.join(".\n"));
			}
		});
	});
	return r;
}
export async function updateFHIRResource(
	resourceType,
	oldResource,
	updatedResource
) {
	let r = apiTimeout(async () => {
		const searchUrl = `${process.env.REACT_APP_FHIRBASE}/${resourceType}/${oldResource.id}`;
		const headers = new Headers();
		const authenticationValue = getBasicAuthCreds();
		headers.set("Authorization", "Basic " + authenticationValue);
		headers.set("Content-Type", "application/json-patch+json");
		let errorMessages;

		const updateResult = await fetch(searchUrl, {
			method: "PATCH",
			headers: headers,
			/* body: updatedResource.toFHIRJson(), */
			body: updatedResource,
		}).then(async (response) => {
			if (!response.ok) {
				if (response.status == 400) {
					try {
						const jsonResponse = await response.json();
						console.log(jsonResponse);
						errorMessages = jsonResponse.issue
							.filter((issue) => issue["severity"] == "error")
							.map((issue) => {
								console.log("issue is: ", issue);
								let s = "";
								if (issue.expression)
									s += "Issue in " + issue["expression"].join(",") + ": ";
								if (issue.details) s += issue.details.text;
								console.log(s);
								return decodeHtml(s);
							});
					} catch (e) {
						console.log("caught error trying to decode issues: ", e);
						throw new updateError(
							"There was an error updating this resource. Check if all input values follow the specified constraints."
						);
					}
					if (errorMessages) throw new updateError(errorMessages.join("\n"));
					else
						throw new updateError(
							"There was an error updating this resource. Check if all input values follow the specified constraints."
						);
				}
				if (response.status == 401)
					throw new authenticationError(
						"Authentication failed. You might need to login again."
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
		});
	}, 10000);
	return r;
}

export async function deleteResources(ids, resourceType) {
	let r = apiTimeout(async () => {
		const headers = new Headers();
		const authenticationValue = getBasicAuthCreds();
		headers.set("Authorization", "Basic " + authenticationValue);
		let errorMessages;

		const results = await Promise.all(
			ids.map(async (id) => {
				const searchUrl = `${process.env.REACT_APP_FHIRBASE}/${resourceType}/${id}`;

				headers.set("Content-Type", "application/fhir+json");

				await fetch(searchUrl, {
					method: "DELETE",
					headers: headers,
				}).then(async (response) => {
					if (!response.ok) {
						if (response.status == 400) {
							try {
								const jsonResponse = await response.json();
								console.log(jsonResponse);
								errorMessages = jsonResponse.issue
									.filter((issue) => issue["severity"] == "error")
									.map((issue) => {
										console.log("issue is: ", issue);
										let s = "";
										if (issue.expression)
											s += "Issue in " + issue["expression"].join(",") + ": ";
										if (issue.details) s += issue.details.text;
										console.log(s);
										return decodeHtml(s);
									});
							} catch (e) {
								console.log("caught error trying to decode issues: ", e);
								throw new updateError(
									"There was an unexpected error deleting this resource."
								);
							}
							if (errorMessages)
								throw new updateError(errorMessages.join("\n"));
							else
								throw new updateError(
									"There was an unexpected error deleting this resource."
								);
						}
						if (response.status == 401)
							throw new authenticationError(
								"Authentication failed. You might need to login again."
							);
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
				});
			})
		);
	});
	return r;
}

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

export const apiTimeout = async (apiCall, timeoutLength) => {
	let timeoutId;
	let timeoutPromise = new Promise(async (resolve, reject) => {
		timeoutId = setTimeout(() => {
			clearTimeout(timeoutId);
			reject(
				new timeoutError(
					"Request taking very long. Try limiting the input or check if the server is online."
				)
			);
		}, timeoutLength || 5000);
	});
	if (apiCall.name != "innerTestBasicAuth" && !getBasicAuthCreds()) {
		clearTimeout(timeoutId);
		throw new authenticationError("Session expired. You need to login first.");
	}
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
	//const searchUrl = `${process.env.REACT_APP_FHIRBASE}/fhir/R4/${resourcetype}?${paramsAndModifiers}`;
	const searchUrl = `${process.env.REACT_APP_FHIRBASE}/${resourcetype}?`;

	const headers = new Headers();
	const authenticationValue = getBasicAuthCreds();
	headers.set("Authorization", "Basic " + authenticationValue);

	var errorMessages;
	let results = await fetch(searchUrl, { method: "GET", headers: headers })
		.then((response) => {
			if (response.status == 401)
				throw new authenticationError(
					"Authentication failed. You might need to login again."
				);
			if (!response.ok) {
				console.log(response);
			}
			return response.json();
		})
		.then((data) => {
			if (data["resourceType"] == "OperationOutcome") {
				errorMessages = data.issue
					.filter((issue) => issue["severity"] == "error")
					.map((element) => {
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

			return data.entry
				? data.entry.map((element) => {
						return { ...element.resource };
				  })
				: [];
		});
	return results;
}

export async function getAttachment(url) {
	// This functionality will be added if the IBM server supports the _filter option to allow logical OR on multiple element types, not only on the values
	// of a single element Type.
	//const searchUrl = `${process.env.REACT_APP_FHIRBASE}/fhir/R4/${resourcetype}?${paramsAndModifiers}`;
	const searchUrl = url;
	const headers = new Headers();
	const authenticationValue = getBasicAuthCreds();
	headers.set("Authorization", "Basic " + authenticationValue);
	return fetch(searchUrl, { method: "GET", headers: headers });
}

function decodeHtml(html) {
	var txt = document.createElement("textarea");
	txt.innerHTML = html;
	return txt.value;
}
