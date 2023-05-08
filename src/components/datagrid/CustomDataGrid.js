import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
	Backdrop,
	Button,
	CircularProgress,
	LinearProgress,
	Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import { display } from "@mui/system";
import { DataGrid, GridFooter, GridHeader } from "@mui/x-data-grid";
import * as React from "react";
import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import { v4 as uuidv4 } from "uuid";
import { constructList } from "../../utilities/formatting/helpConstructInstances";
import InputDialog from "../resourceInputs/InputDialog";
import { useRef } from "react";
import { getPageData } from "../../utilities/querying/query";

/**
 * Utilizes MUI Datagrid. Receives Class Instances of a resource type and displays them in rows.
 * @param {*} resourceType The resourceType name, f.e. "Patient"
 * @param {*} columns The columns to display for this type
 * @param {*} rows The instances to display as rows
 * @param {*} updateRows Callback to update Rows
 * @param {*} newResources List of resources that were added manually.
 * @param {*} updateNewResources Callback to update the new resources
 * @param {*} deleteSelectedResources Callback to delete all the selected resources
 * @param {*} saveUpdates Callback to save changes to a resource
 * @param {*} loading Display loading spinner?
 * @returns
 */
export default function CustomDataGrid({
	resourceType,
	columns,
	rows,
	rowCount,
	updateRows,
	newResources,
	updateNewResources,
	deleteSelectedResources,
	saveUpdates,
	updatePage,
}) {
	const [paginationModel, setPaginationModel] = React.useState({
		page: 0,
		pageSize: 10,
	});
	const [loading, setloading] = useState(false);
	const nextOrPrev = useRef("");
	useEffect(() => {
		console.log(nextOrPrev.current);
		updatePage(resourceType, nextOrPrev.current);
	}, [paginationModel.page]);

	useEffect(() => {
		setloading(false);
	}, [rows]);

	// control Dialog for editing a resource
	const [open, setOpen] = useState(false);

	// show backdrop while loading
	const [backDropOpen, setBackDropOpen] = useState(false);

	// keep a copy of the original resource when editing a resource
	const [originalResource, setOriginalResource] = useState(null);

	// Selection for datagrid
	const [selectedResources, setSelectedResources] = useImmer([]);

	//utility for manual rerender
	const [rerender, setRerender] = useState(false);
	const triggerRerender = () => {
		setRerender((prev) => !prev);
	};

	// open Editing dialog
	useEffect(() => {
		if (originalResource !== null) {
			setOpen(true);
			setBackDropOpen(false);
		}
	}, [originalResource]);

	// save the changes made to a resource
	const handleSaveUpdates = async (editedResource) => {
		let updateResult = await saveUpdates(
			resourceType,
			originalResource,
			editedResource
		);
		if (updateResult == "OK") {
			return true;
		} else {
			return false;
		}
	};

	// delete selected resources
	const handleDelete = async () => {
		await deleteSelectedResources(selectedResources, resourceType);
	};

	// Create a new instance of that resource type and add it to the lists and set the original Resource
	const addRow = () => {
		setBackDropOpen(true);
		const newInstance = new constructList[resourceType]({ id: uuidv4() });
		console.log(newInstance);
		updateNewResources([...newResources, newInstance], resourceType);
		updateRows([...rows, newInstance], resourceType);
		setOriginalResource(newInstance);
	};

	// expand a row on doubleclick
	const handleRowDoubleClick = (params, e, d) => {
		let i = rows.indexOf(params.row);
		rows[i].internalReactExpanded = !rows[i].internalReactExpanded;
		triggerRerender();
	};

	// just handles clicks on the editbutton or the expand button
	const handleCellClick = (params, event, details) => {
		if (!loading && params.colDef.field == "editButton") {
			setOriginalResource(params.row);
			setBackDropOpen(true);
		}
		if (!loading && params.colDef.field == "expandButton") {
			let i = rows.indexOf(params.row);
			rows[i].internalReactExpanded = !rows[i].internalReactExpanded;
			triggerRerender();
		}
	};

	// Modification of the Datagrid Footer
	const MyFooter = () => {
		return (
			<>
				<GridFooter sx={{ "&.MuiDataGrid-footerContainer": {} }}> </GridFooter>
				<Box
					sx={{
						display: "flex",
						flexDirection: "row",
						width: "100%",
						justifyContent: "start",
						columnGap: "5px",
					}}
				>
					<Button
						variant="outlined"
						color="success"
						onClick={() => {
							addRow();
						}}
						sx={{ columnGap: "4px" }}
					>
						<AddCircleOutlineIcon />
						Add {resourceType}
					</Button>
					<Button
						sx={{}}
						disabled={selectedResources.length == 0}
						variant="contained"
						color="error"
						onClick={handleDelete}
					>
						Delete selected
					</Button>
				</Box>
			</>
		);
	};

	// Modification of the Datagrid Header
	const MyHeader = () => {
		return (
			<>
				<GridHeader></GridHeader>
				<Box
					sx={{ paddingLeft: "15px", display: "flex", flexDirection: "column" }}
				>
					<h2>{resourceType}</h2>
					<Typography variant="subtitle2">
						{rowCount} resources found
					</Typography>
				</Box>
			</>
		);
	};

	return (
		<Box
			sx={{
				width: "100%",
				height: "70vh",
			}}
		>
			{originalResource ? (
				<InputDialog
					resourceType={resourceType}
					open={open}
					handleClose={() => {
						setOpen(false);
						setOriginalResource(null);
						if (newResources.includes(originalResource)) {
							// delete row again if it was just added. If you wanted to keep it, should've clicked "save" button, not close
							updateNewResources(
								newResources.filter((item) => item !== originalResource),
								resourceType
							);
							updateRows(
								rows.filter((item) => item !== originalResource),
								resourceType
							);
						}
					}}
					resource={originalResource}
					saveUpdates={handleSaveUpdates}
				/>
			) : null}
			<Backdrop sx={{ color: "white", zIndex: 1 }} open={backDropOpen}>
				<CircularProgress color="inherit" />
			</Backdrop>

			<DataGrid
				getRowHeight={() => "auto"}
				rows={rows}
				columns={columns}
				rowsPerPageOptions={[20]}
				pageSize={20}
				onPageChange={(newPage) => {
					setloading(true);
					nextOrPrev.current =
						newPage > paginationModel.page ? "next" : "previous";
					setPaginationModel({ ...paginationModel, page: newPage });
				}}
				checkboxSelection
				disableSelectionOnClick
				onSelectionModelChange={(newSelection) => {
					if (!loading) setSelectedResources(newSelection);
				}}
				selectionModel={selectedResources}
				experimentalFeatures={{ newEditingApi: true }}
				onCellClick={handleCellClick}
				onRowDoubleClick={handleRowDoubleClick}
				components={{
					Footer: MyFooter,
					Header: MyHeader,
				}}
				loading={loading}
				disableRowSelectionOnClick={loading}
				disableVirtualization
				rowCount={rowCount}
				paginationModel={paginationModel}
				paginationMode="server"
				pagination
				keepNonExistentRowsSelected
			/>
		</Box>
	);
}
