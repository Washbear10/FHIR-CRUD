import * as React from "react";
import Box from "@mui/material/Box";
import {
	DataGrid,
	GridAddIcon,
	GridFooter,
	GridHeader,
} from "@mui/x-data-grid";
import { Button, IconButton, LinearProgress } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { resourcesAttributes } from "../utilities/resourceAttributes";
import { v4 as uuidv4 } from "uuid";
import { constructList } from "../utilities/helpConstructInstances";
import InputDialog from "./resourceInputs/InputDialog";
import { useImmer } from "use-immer";
import { updateFHIRResource } from "../utilities/query";
import { Backdrop, CircularProgress } from "@mui/material";
import { useTheme } from "@emotion/react";
export default function CustomDataGrid({
	resourceType,
	columns,
	rows,
	updateRows,
	changedResources,
	updateChangedResources,
	newResources,
	updateNewResources,
	deleteSelectedResources,
	saveUpdates,
	loading,
}) {
	const [open, setOpen] = useState(false);
	const [originalResource, setOriginalResource] = useState(null);
	const [selectedResources, setSelectedResources] = useImmer([]);
	const [backDropOpen, setBackDropOpen] = useState(false);

	const [rerender, setRerender] = useState(false);

	const triggerRerender = () => {
		setRerender((prev) => !prev);
	};

	useEffect(() => {
		if (originalResource !== null) {
			setOpen(true);
			setBackDropOpen(false);
		}
	}, [originalResource]);

	useEffect(() => {
		console.log("CDG rerendered");
	}, [
		resourceType,
		columns,
		rows,
		updateRows,
		changedResources,
		updateChangedResources,
		newResources,
		updateNewResources,
		deleteSelectedResources,
		saveUpdates,
		loading,
	]);

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

	const handleDelete = async () => {
		await deleteSelectedResources(selectedResources, resourceType);
	};

	const addRow = () => {
		const newInstance = new constructList[resourceType]({ id: uuidv4() });
		updateNewResources([...newResources, newInstance], resourceType);
		updateRows([...rows, newInstance], resourceType);
		setOriginalResource(newInstance);
		setOpen(true);
	};

	const handleRowDoubleClick = (params, e, d) => {
		let i = rows.indexOf(params.row);

		rows[i].internalReactExpanded = !rows[i].internalReactExpanded;
		triggerRerender();
		//updateRows([...rows, newInstance], resourceType);
	};

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

	const MyHeader = () => {
		return (
			<>
				<GridHeader></GridHeader>
				<Box sx={{ paddingLeft: "15px" }}>
					<h2>{resourceType}</h2>
				</Box>
			</>
		);
	};

	return (
		<Box
			sx={{
				height: 700,
				width: "100%",
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
				//pageSize={10}
				//rowsPerPageOptions={[5, 10, 20]}
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
					LoadingOverlay: () => <LinearProgress />,
				}}
				loading={loading}
				disableRowSelectionOnClick={loading}
				disableVirtualization
			/>
		</Box>
	);
}
