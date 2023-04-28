import { Divider } from "@mui/material";
import Box from "@mui/material/Box";
import { Stack } from "@mui/system";
import PropTypes from "prop-types";
import * as React from "react";

/**
 * Component to insert into Datagrid cells
 * @param {*} value A string representation of the value, seperated by newlines if cardinality > 0
 * @param {*} rowExpanded display all values in field?
 */
const ExpandableCell = ({ value, rowExpanded }) => {
	const [splitString, setSplitString] = React.useState(value.split("\n"));

	React.useEffect(() => {
		setSplitString(value.split("\n"));
	}, [value]);
	return (
		<Stack
			spacing={1}
			divider={
				<Divider orientation="horizontal" flexItem variant="middle" light />
			}
			sx={{ width: "100%" }}
		>
			{rowExpanded ? (
				splitString.map((line, index) => {
					return (
						<Box
							key={index}
							sx={{
								overflowWrap: "break-word",
							}}
						>
							{line}
						</Box>
					);
				})
			) : (
				<Box
					key={0}
					sx={{
						textOverflow: "ellipsis",
						overflow: "clip",
					}}
				>
					{splitString[0]}
				</Box>
			)}
		</Stack>
	);
};

ExpandableCell.propTypes = {
	/**
	 * The cell value.
	 * If the column has `valueGetter`, use `params.row` to directly access the fields.
	 */
	value: PropTypes.any,
};

export default React.memo(ExpandableCell);
