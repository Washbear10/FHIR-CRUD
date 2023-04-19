import React from "react";
import { Box } from "@mui/system";
import {
	AlertTitle,
	Button,
	CircularProgress,
	DialogContent,
	IconButton,
	Skeleton,
} from "@mui/material";
import CustomAppBar from "../../components/CustomAppBar";
import CustomDataGrid from "../../components/CustomDataGrid";
import SearchForm from "../../components/SearchForm";
import ResourceView from "../../components/ResourceView";
import { medplum } from "../../index";
import queryFHIR, {
	allResources,
	testCreate,
	deleteResources,
	updateFHIRResource,
	testError,
	getToken,
	createFHIRResource,
	apiTimeout,
	testsearch,
	searchReference,
} from "../../utilities/query";
import { useState, useEffect } from "react";
import {
	createResourceInstance,
	resourcesAttributes,
} from "../../utilities/resourceAttributes";
import { useImmer } from "use-immer";
import { getRenderCellComponent } from "./renderCell";
import { HumanName } from "../../classes/dataTypes/HumanName";
import { Patient } from "../../classes/resourceTypes/Patient";
import Testpicker from "../../components/Testpicker";
import { getDateTimeParts } from "../../utilities/parseDateTime";
import SmallTextField from "../../components/styledComponents/SmallTextField";
import dayjs from "dayjs";
import DateTabs from "../../components/common/DateTabs";
import removeInternalReactID from "../../utilities/fhirify";
import { queryError, updateError } from "../../utilities/errors";
import { Snackbar, Alert } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Dialog, DialogTitle, DialogActions } from "@mui/material";
import ConfirmDeleteDialog from "../../components/ConfirmDeleteDialog";
import { constructList } from "../../utilities/helpConstructInstances";

const Home = () => {
	// state for Search Component
	const [resourceList, setResourceList] = useState([]);
	const [inputValue, setInputValue] = useState("");
	const [limit, setLimit] = useState("-");
	const [filterResource, setFilterResource] = useState(false);

	// state for Datagrids
	const [results, setResults] = useImmer({});
	const [changedResources, setChangedResources] = useImmer({});
	const [newResources, setNewResources] = useImmer({});

	const [loading, setLoading] = useState(false);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarColor, setSnackbarColor] = useState("");
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarTitle, setSnackbarTitle] = useState("");

	const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
	const [confirmed, setConfirmed] = useState(false);

	const [deleteCandidates, setDeleteCandidates] = useState([]);
	const [deleteCandidatType, setDeleteCandidatType] = useState(null);

	const handleCatchError = (error) => {
		setSnackbarColor("error");
		setSnackbarMessage(error.message);
		setSnackbarOpen(true);
		setSnackbarTitle("Error");
		/* setResults({});
		setInitialResources({}); */
	};

	const handleSearch = async (event) => {
		if (event) event.preventDefault();
		setLoading(true);
		try {
			const queryResult = await queryFHIR({
				resources: filterResource ? resourceList : allResources,
				limit: limit,
			});
			console.log(queryResult);
			setResults(queryResult);
			//setInitialResources(queryResult);
			setLoading(false);
		} catch (error) {
			handleCatchError(error);
			setLoading(false);
			return error;
		}
	};

	// methods passed down to Search Component
	const updateResourceList = (updatedResourceList) => {
		setResourceList(updatedResourceList);
	};
	const updateInputValue = (newVal) => {
		setInputValue(newVal);
	};
	const updateLimit = (newLimit) => {
		setLimit(newLimit);
	};
	const updateFilterResource = (filter) => {
		setFilterResource(filter);
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
	const saveUpdates = async (
		resourceType,
		originalResource,
		editedResource
	) => {
		let updated = false;
		let created = false;
		try {
			// This if block shall be removed when switching to IBM server as Medplum does not yet support update as create
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
				let r = await updateFHIRResource(
					resourceType,
					originalResource,
					editedResource
				);
				updated = true;
			}
		} catch (error) {
			handleCatchError(error);
			return error;
		}
		try {
			handleSearch();
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

	const deleteSelectedResources = async (resourceIDs, type) => {
		setDeleteCandidates([]);
		setDeleteCandidatType(null);
		setConfirmDeleteOpen(false);
		setLoading(true);
		try {
			await deleteResources(resourceIDs, type);
		} catch (error) {
			alert("here");
			handleCatchError(error);
			return error;
		}
		await handleSearch();
		setLoading(false);
		setSnackbarColor("success");
		setSnackbarMessage("Resources deleted");
		setSnackbarOpen(true);
		setSnackbarTitle("Success");
	};

	/* const resetSearch = async () => {
		const queryResult = await queryFHIR({
			resources: filterResource ? resourceList : allResources,
			limit: limit,
		});
		setResults(queryResult);
		setInitialResources(queryResult);
		
		
	}; */

	const getRenderCell = (resourcesType, element, params) => {
		return getRenderCellComponent(resourcesType, element, params.value);
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: "1rem",
			}}
		>
			<Snackbar
				autoHideDuration={snackbarColor == "success" ? 3000 : null}
				open={snackbarOpen}
				onClose={() => {
					setSnackbarOpen(false);
				}}
				message="Note archived"
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
			>
				<Alert
					color={snackbarColor}
					sx={{ width: "40vw", minHeight: "5rem", alignItems: "flex-start" }}
					severity={snackbarColor || "success"}
					variant="filled"
				>
					<AlertTitle>{snackbarTitle}</AlertTitle>
					{snackbarMessage}
				</Alert>
			</Snackbar>
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
					/* let r = await searchReference("Patient", "name:contains=");
					console.log(r); */
					alert(process.env.REACT_APP_FHIR_BASE);
				}}
			>
				Test Error
			</Button>
			<SearchForm
				onSubmit={handleSearch}
				resourceList={resourceList}
				updateResourceList={updateResourceList}
				inputValue={inputValue}
				updateInputValue={updateInputValue}
				filterResource={filterResource}
				updateFilterResource={updateFilterResource}
				limit={limit}
				updateLimit={updateLimit}
			/>
			{loading ? (
				<CircularProgress color="primary" sx={{ margin: "0 auto" }} />
			) : null}
			{Object.keys(results).map((resourceType) => {
				let columns;
				let helperInstance = new constructList[resourceType]({});
				const classProperties = Object.keys(helperInstance).filter(
					(element) => element != "internalReactID"
				);
				columns = classProperties.map((property) => {
					const columnDefinition = {
						field: property,
						headerName: property,
						width: property == "id" || property == "name" ? 300 : 150,
						editable: false,
						renderCell: (params) =>
							getRenderCell(resourceType, property, params),
					};
					return columnDefinition;
				});
				columns.unshift({
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
				});

				return (
					<CustomDataGrid
						key={resourceType}
						resourceType={resourceType}
						columns={columns}
						rows={results[resourceType]}
						updateRows={updateRows}
						changedResources={changedResources[resourceType] || []}
						updateChangedResources={updateChangedResources}
						newResources={newResources[resourceType] || []}
						updateNewResources={updateNewResources}
						deleteSelectedResources={confirmDelete}
						saveUpdates={saveUpdates}
						loading={loading}
					/>
				);
			})}
		</Box>
	);
};

export default Home;
