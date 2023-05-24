import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { v4 } from "uuid";

const columns = [
	{ field: "id", headerName: "ID", width: 90 },
	{
		field: "firstName",
		headerName: "First name",
		width: 150,
		editable: true,
	},
	{
		field: "lastName",
		headerName: "Last name",
		width: 150,
		editable: true,
	},
	{
		field: "age",
		headerName: "Age",
		type: "number",
		width: 110,
		editable: true,
	},
	{
		field: "fullName",
		headerName: "Full name",
		description: "This column has a value getter and is not sortable.",
		sortable: false,
		width: 160,
		valueGetter: (params) =>
			`${params.row.firstName || ""} ${params.row.lastName || ""}`,
	},
];

class TestRow {
	constructor({ id, lastName, firstName, age }) {
		this.id = id;
		this.lastName = lastName;
		this.firstName = firstName;
		this.age = age;
	}
}

const startRows = [
	new TestRow({
		id: v4(),
		lastName: (Math.random() + 1).toString(36).substring(7),
		firstName: (Math.random() + 1).toString(36).substring(7),
		age: Math.floor(Math.random() * 100),
	}),
	new TestRow({
		id: v4(),
		lastName: (Math.random() + 1).toString(36).substring(7),
		firstName: (Math.random() + 1).toString(36).substring(7),
		age: Math.floor(Math.random() * 100),
	}),
	new TestRow({
		id: v4(),
		lastName: (Math.random() + 1).toString(36).substring(7),
		firstName: (Math.random() + 1).toString(36).substring(7),
		age: Math.floor(Math.random() * 100),
	}),
];

export default function DataGridDemo() {
	const [rows, setRows] = React.useState([]);
	const [paginationModel, setPaginationModel] = React.useState({
		page: 0,
		pageSize: 3,
	});
	React.useEffect(() => {
		let n = [];
		for (let i = 0; i < 3; i++) {
			n.push(
				new TestRow({
					id: v4(),
					lastName: (Math.random() + 1).toString(36).substring(7),
					firstName: (Math.random() + 1).toString(36).substring(7),
					age: Math.floor(Math.random() * 100),
				})
			);
		}
		setRows(n);
	}, [paginationModel.page]);
	return (
		<Box sx={{ height: 400, width: "100%" }}>
			<DataGrid
				rows={rows}
				columns={columns}
				onPageChange={(newPage) => {
					setPaginationModel({ ...paginationModel, page: newPage });
				}}
				rowsPerPageOptions={[3]}
				pageSize={3}
				checkboxSelection
				disableRowSelectionOnClick
				paginationModel={paginationModel}
				paginationMode="server"
				pagination
				rowCount={30}
			/>
		</Box>
	);
}
