import { Button, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import CustomDataGrid from "../../components/datagrid/CustomDataGrid";
import queryFHIR, {
	createFHIRResource,
	deleteResources,
	getNextPageData,
	getPageData,
	testInitialQuery,
	updateFHIRResource,
} from "../../utilities/querying/query";
import SearchForm from "./SearchForm";

import { useImmer } from "use-immer";

import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ConfirmDeleteDialog from "../../components/datagrid/ConfirmDeleteDialog";
import {
	clearObjectFromEmptyValues,
	isObjectEmptyRecursive,
} from "../../utilities/formatting/fhirify";
import { constructList } from "../../utilities/formatting/helpConstructInstances";
import { LoginContext, SnackbarContext } from "../../utilities/other/Contexts";
import {
	authenticationError,
	timeoutError,
} from "../../utilities/querying/errors";
import { Patient } from "../../classes/resourceTypes/Patient";
import { getBasicAuthCreds } from "../../utilities/authentication/basicAuth";
import Test from "../../components/test/Test";
import DataGridDemo from "../../components/test/Test";
const Home = () => {
	// state for Search Component
	const [selectedSearchResource, setSelectedSearchResource] =
		useState("Patient");
	const [inputValue, setInputValue] = useState("");
	const [limit, setLimit] = useState("-");

	// state for Datagrids
	const [results, setResults] = useImmer({});
	const [changedResources, setChangedResources] = useImmer({});
	const [newResources, setNewResources] = useImmer({});
	const [nextPageLink, setNextPageLink] = useImmer({
		Patient: "",
		Organization: "",
	});
	const [prevPageLink, setPrevPageLink] = useImmer({
		Patient: "",
		Organization: "",
	});
	const [resultCount, setResultCount] = useImmer({
		Patient: null,
		Organization: null,
	});

	// states for ui elements
	const [loading, setLoading] = useState(false);
	const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

	// states for deleting of resources
	const [deleteCandidates, setDeleteCandidates] = useState([]);
	const [deleteCandidatType, setDeleteCandidatType] = useState(null);

	const [testData, setTestData] = useState([]);

	// needed to open Login prompt up the hirarchy
	const { authenticationPromptOpen, setAuthenticationPromptOpen } =
		React.useContext(LoginContext);

	// needed for Snackbar display up the hirarchy
	const {
		snackbarOpen,
		setSnackbarOpen,
		snackbarColor,
		setSnackbarColor,
		snackbarMessage,
		setSnackbarMessage,
		snackbarTitle,
		setSnackbarTitle,
	} = React.useContext(SnackbarContext);

	// function to fetch FHIR data
	const handleSearch = async ({ event, searchValue, limit }) => {
		if (event) event.preventDefault();
		setLoading(true);
		try {
			/* const queryResult = await queryFHIR(
				resourceList,
				searchValue,
				parseInt(limit) || 0
			); */
			const queryResult = await testInitialQuery(
				selectedSearchResource,
				searchValue
			);
			console.log(queryResult);
			setResults((prev) => {
				prev[selectedSearchResource] = queryResult["results"];
			});
			setNextPageLink((prev) => {
				prev[selectedSearchResource] = queryResult["nextPageLink"];
			});
			setResultCount((prev) => {
				prev[selectedSearchResource] = queryResult["resultCount"];
			});
			setLoading(false);
		} catch (error) {
			handleCatchError(error);
			setLoading(false);
			return error;
		}
	};

	const updatePage = async (resourceType, nextOrPrev) => {
		if (nextOrPrev == "next") {
			if (!nextPageLink[resourceType]) return;
			else {
				const result = await getPageData(
					nextPageLink[resourceType],
					resourceType
				);
				console.log(result);
				setNextPageLink((prev) => {
					prev[selectedSearchResource] = result["nextPageLink"];
				});
				setPrevPageLink((prev) => {
					prev[selectedSearchResource] = result["prevPageLink"];
				});
				setResults((prev) => {
					prev[selectedSearchResource] = result["results"];
				});
			}
		} else if (nextOrPrev == "previous") {
			if (!prevPageLink[resourceType]) return;
			else {
				const result = await getPageData(
					prevPageLink[resourceType],
					resourceType
				);
				console.log(result);
				setNextPageLink((prev) => {
					prev[selectedSearchResource] = result["nextPageLink"];
				});
				setPrevPageLink((prev) => {
					prev[selectedSearchResource] = result["prevPageLink"];
				});
				setResults((prev) => {
					prev[selectedSearchResource] = result["results"];
				});
			}
		}
	};

	const updatePrev = (resourceType, url) => {
		setPrevPageLink((prev) => {
			prev[resourceType] = url;
		});
	};
	const updateNext = (resourceType, url) => {
		setNextPageLink((prev) => {
			prev[resourceType] = url;
		});
	};

	const handleCatchError = (error) => {
		if (error instanceof timeoutError) {
			setSnackbarColor("warning");
			setSnackbarMessage(error.message);
			setSnackbarOpen(true);
			setSnackbarTitle("Warning");
		} else if (error instanceof authenticationError) {
			setSnackbarColor("error");
			setSnackbarMessage(error.message);
			setSnackbarOpen(true);
			setSnackbarTitle("Error");
			setAuthenticationPromptOpen(true);
		} else {
			setSnackbarColor("error");
			console.log(error);
			setSnackbarMessage(error.message);
			setSnackbarOpen(true);
			setSnackbarTitle("Error");
		}
	};
	// methods passed down to Search Component
	const updateInputValue = (newVal) => {
		setInputValue(newVal);
	};
	const updateSelectedSearchResource = (newSearchResource) => {
		setSelectedSearchResource(newSearchResource);
	};
	//methods passed down to CustomDataGrids
	const updateRows = (newRows, resourceType) => {
		setResults((draft) => {
			draft[resourceType] = newRows;
		});
	};
	const updateChangedResources = (changedRows, resourceType) => {
		setChangedResources((draft) => {
			draft[resourceType] = changedRows;
		});
	};
	const updateNewResources = (newRows, resourceType) => {
		setNewResources((draft) => {
			draft[resourceType] = newRows;
		});
	};

	const expandRow = (resourceType, index) => {
		setResults((draft) => {
			draft[resourceType][index].internalReactExpanded =
				!draft[resourceType][index].internalReactExpanded;
		});
	};

	// If changing an existing resource, we only want to patch the changed data -> saves bandwith -> improves performance.
	// Create list of PATCH operations needed.
	const makePatchFormat = (originalResource, editedResource) => {
		let changedKeys = [];
		Object.keys(editedResource).forEach((key) => {
			if (editedResource[key] == originalResource[key]) {
				console.log("key value is same reference -> wasnt changed:");
			} else {
				if (
					isObjectEmptyRecursive(editedResource[key]) &&
					!isObjectEmptyRecursive(originalResource[key])
				) {
					// that value was deleted
					changedKeys.push({ op: "remove", path: `/${key}` });
				} else {
					// both adding and editing data works with the "add" operation
					let sp = JSON.parse(JSON.stringify(editedResource[key]));
					clearObjectFromEmptyValues(sp);
					changedKeys.push({
						op: "add",
						path: `/${key}`,
						value: sp,
					});
				}
			}
		});
		return JSON.stringify(changedKeys);
	};

	// save changes or additional Resources
	const saveUpdates = async (
		resourceType,
		originalResource,
		editedResource
	) => {
		let updated = false;
		let created = false;
		try {
			// This if block might be removed when activating updateAsCreate functionality on IBM config
			if (
				newResources[resourceType] &&
				newResources[resourceType].includes(originalResource)
			) {
				let r = await createFHIRResource(resourceType, editedResource);
				let newNewResources = newResources[resourceType].filter(
					(item) => item !== originalResource
				);
				updateNewResources(newNewResources, resourceType);
				created = true;
			} else {
				let patchFormat = makePatchFormat(originalResource, editedResource);
				await updateFHIRResource(resourceType, originalResource, patchFormat);
				updated = true;
			}
		} catch (error) {
			handleCatchError(error);
			return error;
		}
		try {
			handleSearch({ searchValue: inputValue, limit: parseInt(limit) || 0 });
			setSnackbarColor("success");
			setSnackbarMessage(
				updated
					? "Resource successfully updated."
					: created
					? "Resource sucessfully created."
					: "Success"
			);
			setSnackbarTitle("Success");
			setSnackbarOpen(true);
			return "OK";
		} catch (error) {
			handleCatchError(error);
			return error;
		}
	};

	const confirmDelete = async (resourceIDs, type) => {
		setDeleteCandidates(resourceIDs);
		setDeleteCandidatType(type);
		setConfirmDeleteOpen(true);
	};

	// call delete on API on resources selected in the datagrid
	const deleteSelectedResources = async (resourceIDs, type) => {
		setDeleteCandidates([]);
		setDeleteCandidatType(null);
		setConfirmDeleteOpen(false);
		setLoading(true);
		try {
			await deleteResources(resourceIDs, type);
		} catch (error) {
			handleCatchError(error);
			return error;
		}
		await handleSearch({
			searchValue: inputValue,
			limit: parseInt(limit) || 0,
		});
		setLoading(false);
		setSnackbarColor("success");
		setSnackbarMessage("Resources deleted");
		setSnackbarOpen(true);
		setSnackbarTitle("Success");
	};

	// submit Search form
	const handleSubmit = ({ event, searchValue }) => {
		handleSearch({ event: event, searchValue: searchValue });
		setInputValue(searchValue);
		setLimit(limit);
	};

	// render section
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: "1rem",
			}}
		>
			<ConfirmDeleteDialog
				open={confirmDeleteOpen}
				confirm={() => {
					deleteSelectedResources(deleteCandidates, deleteCandidatType);
				}}
				cancel={() => {
					setConfirmDeleteOpen(false);
					setDeleteCandidatType(null);
					setDeleteCandidates([]);
				}}
			/>
			<Button
				onClick={async () => {
					const headers = new Headers();
					const authenticationValue = getBasicAuthCreds();
					headers.set("Authorization", "Basic " + authenticationValue);
					fetch("https://localhost:9443/fhir-server/api/v4/Patient", {
						headers: headers,
					})
						.then((response) => {
							let j = response.json();
							return j;
						})
						.then((data) => {
							let r = data.entry.map(
								(item) => new Patient({ ...item.resource })
							);
							setTestData(r);
						});
				}}
			>
				Test Error
			</Button>
			<SearchForm
				onSubmit={handleSubmit}
				selectedSearchResource={selectedSearchResource}
				updateSelectedSearchResource={updateSelectedSearchResource}
				updateInputValue={updateInputValue}
			/>
			{loading ? (
				<CircularProgress color="primary" sx={{ margin: "0 auto" }} />
			) : null}
			{Object.keys(results).map((resourceType) => {
				// map over each resource type (currently only Patient) and create
				// the columns and rows for the datagrid
				let columns;

				//need helper instance to map over properties
				let helperInstance = new constructList[resourceType]({});
				// filter out custom attributes used for react stuff as well as undisplayabled data
				const classProperties = Object.keys(helperInstance).filter(
					(element) =>
						element != "internalReactID" &&
						element != "internalReactExpanded" &&
						element != "photo" // hardcoded for patient, find better solution when adding other stuff
				);

				columns = classProperties.map((property) => {
					const columnDefinition = {
						field: property,
						headerName: property,
						width:
							property == "id"
								? 300
								: property == "name" ||
								  property == "address" ||
								  property == "telecom"
								? 250
								: property.length > 10
								? 200
								: 100,

						editable: false,
						// call class instance function of the resource type to find out how to render it
						renderCell: (params) =>
							constructList[resourceType].getAttributeDisplay(
								property,
								params.value,
								params.row.internalReactExpanded
							),
					};

					return columnDefinition;
				});

				// add two buttons at beginning
				columns.unshift(
					{
						field: "editButton",
						headerName: "",
						editable: false,
						sortable: false,
						flex: 1,
						disableColumnMenu: true,
						align: "center",
						renderCell: (row) => (
							<IconButton>
								<EditIcon color="primary" />
							</IconButton>
						),
					},
					{
						field: "expandButton",
						headerName: "",
						editable: false,
						sortable: false,
						flex: 1,
						disableColumnMenu: true,
						align: "center",
						renderCell: (row) => {
							return (
								<IconButton>
									<Tooltip
										title={
											row.row.internalReactExpanded
												? "Collapse row"
												: "Expand row"
										}
									>
										<div>
											{row.row.internalReactExpanded ? (
												<KeyboardArrowUpIcon color="primary" />
											) : (
												<KeyboardArrowDownIcon color="primary" />
											)}
										</div>
									</Tooltip>
								</IconButton>
							);
						},
					}
				);

				// return the Datagrid for this resource type (currently only Patient).
				return (
					<CustomDataGrid
						key={resourceType}
						resourceType={resourceType}
						columns={columns}
						rows={results[resourceType]}
						rowCount={resultCount[resourceType]}
						updateRows={updateRows}
						changedResources={changedResources[resourceType] || []}
						updateChangedResources={updateChangedResources}
						newResources={newResources[resourceType] || []}
						updateNewResources={updateNewResources}
						deleteSelectedResources={confirmDelete}
						saveUpdates={saveUpdates}
						updatePage={updatePage}
						next={nextPageLink[resourceType]}
						prev={prevPageLink[resourceType]}
						updatePrev={updatePrev}
						updateNext={updateNext}
						expandRow={expandRow}
					/>
				);
			})}
		</Box>
	);
};

export default Home;
