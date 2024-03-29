import { Patient } from "../../classes/resourceTypes/Patient";
import { getBasicAuthCreds } from "../authentication/basicAuth";
import { constructList } from "../formatting/helpConstructInstances";
import {
	authenticationError,
	queryError,
	timeoutError,
	updateError,
} from "./errors";

/**
 * Function to test wether Credentials are accepted
 * @param {*} authenticationValue b64 encoded user:password
 * @returns
 */
export async function testBasicAuth(authenticationValue) {
	let r = apiTimeout(
		async () => {
			console.log("reached inner Auth: ", authenticationValue);
			const headers = new Headers();
			const searchUrl = `${process.env.REACT_APP_FHIRBASE}/$healthcheck`;
			headers.set("Authorization", "Basic " + authenticationValue);
			return await fetch(searchUrl, { method: "GET", headers: headers }).then(
				(response) => {
					if (response.status === 401) {
						return "Unauthenticated";
					} else if (!response.ok) {
						return "Error";
					} else if (response.status === 200) {
						return "Ok";
					}
				}
			);
		},
		5000,
		"testBasicAuth"
	);
	return r;
}

export async function checkOnline() {
	const searchUrl = `${process.env.REACT_APP_FHIRBASE}/$healthcheck`;
	try {
		return await fetch(searchUrl, { method: "GET" }).then((response) => {
			return response.status === 401 || response.status === 200;
		});
	} catch (e) {
		console.log(e);
	}
}

/**
 * Make a POST request to create a resource.
 * @param {*} resourceType type of the resource to append to url string
 * @param {*} newResource the unserialized resource
 * @returns
 */
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
		}).then(async (response) => {
			if (response.status == 401)
				throw new authenticationError(
					"Authentication failed. You might need to login again."
				);
			if (response.status == 400) {
				try {
					let jsonResponse = await response.json();
					console.log(jsonResponse);
					console.log(
						jsonResponse.issue.filter((issue) => issue["severity"] == "error")
					);

					errorMessages = jsonResponse.issue
						.filter((issue) => issue["severity"] == "error")
						.map((issue) => {
							let s = "";
							if (issue.expression)
								s += "Issue in " + issue.expression.join(",") + ": ";
							if (issue.details) s += issue.details.text;
							return s;
						});
					console.log(errorMessages);
				} catch (e) {
					console.log("caught error trying to decode issues: ", e);
				}
				throw new updateError(errorMessages.join(".\n"));
			}
		});
	});
	return r;
}

/**
 * Make a PATCH request to edit a resource.
 * @param {*} resourceType type of the resource to append to url string
 * @param {*} oldResource the old resource, needed for id
 * @param {*} updatedResource the body of the PATCH request
 * @returns
 */
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

/**
 * Wrapper function to throw timeoutErrors if the callback function didn't resolve within a given time.
 * @param {*} apiCall Function that makes api calls
 * @param {*} timeoutLength How long this function should wait for the apiCall to resolve before throwing updaterror.
 * @param {*} apiCallName Name of the calling function. Workaround for the issue that webpack bundles function names so I can't use apiCall.name anymore.
 * @returns
 */
export const apiTimeout = async (apiCall, timeoutLength, apiCallName) => {
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

	// Can't make any request to api as long as no authentication cookies are present
	//if (!getBasicAuthCreds() && apiCall.name != "innerTestBasicAuth") {
	if (!getBasicAuthCreds() && apiCallName != "testBasicAuth") {
		clearTimeout(timeoutId);
		throw new authenticationError("Session expired. You need to login first.");
	}

	const apiCallPromise = apiCall();
	return Promise.race([apiCallPromise, timeoutPromise]).finally(() => {
		clearTimeout(timeoutId);
	});
};

/**
 *  This function differs from the normal queryFHIR function in that it does deserialize the results, but keeps it in JSON. This is because
 *  the referenced types are not (yet) represented in this application (for now only "Patient").
 * @param {*} resourcetype Type of the resource to search for
 * @param {*} paramsAndModifiers Applicable search parameters and modifiers for this resource type.
 * @returns
 */
export async function searchReference(resourcetype, paramsAndModifiers) {
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

/**
 * Fetch some url (used by attachments)
 * @param {*} url
 * @returns
 */
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

/**
 * helper function to display html String correctly (without html entities). Used by errors throwing
 * html content so that it can be displayed by the UI properly.
 * @param {*} html
 * @returns
 */
function decodeHtml(html) {
	var txt = document.createElement("textarea");
	txt.innerHTML = html;
	return txt.value;
}

/**
 * Preflight method to get number of results (without actual resources). Can be used for better pagination handling.
 * Unused for now, can be explored when performance decreases with huge datasets.
 */
async function getResultCount(url) {
	const headers = new Headers();
	const authenticationValue = getBasicAuthCreds();
	headers.set("Authorization", "Basic " + authenticationValue);
	return await fetch(url + "&_summary=count", {
		method: "GET",
		headers: headers,
	})
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

export async function getPageData(pageLink, resourceType) {
	let r = apiTimeout(async () => {
		// store list of resources returned for each type in results
		let results = [];

		// Since this application only implements the Patient input, only Patient resources can be queried.
		// When functionality for other Resources are added, some minor changes will have to be made to this function (mainly regarding search parameters.)
		const headers = new Headers();
		const authenticationValue = getBasicAuthCreds();
		headers.set("Authorization", "Basic " + authenticationValue);
		let nextLink = "";
		let prevLink = "";

		let errorMessages;
		await fetch(pageLink, { method: "GET", headers: headers })
			.then((response) => {
				if (response.status == 401) {
					throw new authenticationError(
						"Authentication failed. You might need to login again."
					);
				}
				if (response.status == 400) {
					// FHIR defines issues that are returned as description of what went wrong.
					// We can use these to display as snackbar error.
					try {
						let jsonResponse = response.json();
						errorMessages = jsonResponse.issue
							.filter((issue) => issue["severity"] == "error")
							.map((issue) => {
								let s = "";
								if (issue.expression)
									s += "Issue in " + issue.expression.join(",") + ": ";
								if (issue.details) s += issue.details.text;
								return s;
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
				// push results to result array
				const pageEntries = data.entry
					? data.entry.map(
							(element) =>
								new constructList[resourceType]({ ...element.resource })
					  )
					: [];
				results = pageEntries;
				if (data.link) {
					const next = data.link.filter((item) => item.relation == "next");
					nextLink = next.length > 0 ? next[0].url : "";
					const prev = data.link.filter((item) => item.relation == "previous");
					prevLink = prev.length > 0 ? prev[0].url : "";
				}
			});

		return { results: results, nextPageLink: nextLink, prevPageLink: prevLink };
	}, 5000);
	return r;
}

export async function testInitialQuery(resourceType, searchString, pageSize) {
	let r = apiTimeout(async () => {
		// store list of resources returned for each type in results
		let results = [];

		// Since this application only implements the Patient input, only Patient resources can be queried.
		// When functionality for other Resources are added, some minor changes will have to be made to this function (mainly regarding search parameters.)
		const headers = new Headers();
		const authenticationValue = getBasicAuthCreds();
		headers.set("Authorization", "Basic " + authenticationValue);
		let count = pageSize || 20;
		let nextPageLink = "";
		// do while for fetching all resources (if server returns batches in multiple pages)
		// search parameter only works for Patient. Please Generalize when extending.
		const searchUrl = `${process.env.REACT_APP_FHIRBASE}/${resourceType}?${
			searchString ? "name:contains=" + searchString + "&" : ""
		}_count=${count}`;

		const resultCount = await getResultCount(searchUrl);

		let errorMessages;
		await fetch(searchUrl, { method: "GET", headers: headers })
			.then((response) => {
				if (response.status == 401) {
					throw new authenticationError(
						"Authentication failed. You might need to login again."
					);
				}
				if (response.status == 400) {
					// FHIR defines issues that are returned as description of what went wrong.
					// We can use these to display as snackbar error.
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
				// push results to result array
				const pageEntries = data.entry
					? data.entry.map(
							(element) =>
								new constructList[resourceType]({ ...element.resource })
					  )
					: [];
				results = pageEntries;
				if (data.link) {
					let next = data.link.filter((item) => item.relation == "next");
					nextPageLink = next.length > 0 ? next[0].url : "";
				}
			});
		let returnValue = {
			results: results,
			resultCount: resultCount,
			nextPageLink: nextPageLink,
		};
		console.log(returnValue);
		return returnValue;
	}, 40000);
	return r;
}

export async function bundleDelete(ids, resourceType) {
	let r = apiTimeout(async () => {
		const headers = new Headers();
		const authenticationValue = getBasicAuthCreds();
		headers.set("Authorization", "Basic " + authenticationValue);
		headers.set("Content-Type", "application/fhir+json");
		let errorMessages;
		let bundleObject = {
			resourceType: "Bundle",
			type: "transaction",
			entry: ids.map((id) => {
				return {
					request: {
						method: "DELETE",
						url: `${resourceType}/${id}`,
					},
				};
			}),
		};

		const searchUrl = `${process.env.REACT_APP_FHIRBASE}/`;
		await fetch(searchUrl, {
			method: "POST",
			headers: headers,
			body: JSON.stringify(bundleObject),
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
							"There was an unexpected error deleting a resource."
						);
					}
					if (errorMessages) throw new updateError(errorMessages.join("\n"));
					else
						throw new updateError(
							"There was an unexpected error deleting a resource."
						);
				}
				if (response.status == 401)
					throw new authenticationError(
						"Authentication failed. You might need to login again."
					);
			}
		});
	});
	return r;
}

export async function manualRequest(url, method, headers, body) {
	const headers_object = new Headers();
	headers.forEach((header) => {
		headers_object.set(header.header, header.value);
	});
	let requestOptions = {
		method: method,
		headers: headers_object,
	};
	if (body) {
		const jsonBody = JSON.stringify(JSON.parse(body));
		if (jsonBody) {
			requestOptions.body = jsonBody;
		}
	}
	return await fetch(url, requestOptions);
	/* return fetch(url, requestOptions)
		.then((response) => {
			return response.json();
		})
		.then((json) => {
			return json;
		}); */
}
