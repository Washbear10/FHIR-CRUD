import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Stack } from "@mui/system";
import { Divider } from "@mui/material";
import { GridCell } from "@mui/x-data-grid";
const ExpandableCell = ({ value, lengthThreshhold, rowExpanded }) => {
	const [splitString, setSplitString] = React.useState(value.split("\n"));

	React.useEffect(() => {
		setSplitString(value.split("\n"));
		console.log("rerendrng of expandl cell");
	}, [value]);
	React.useEffect(() => {
		console.log("rerendrng of expandl cell");
	}, []);

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

/* export default ExpandableCell; */
const areEqual = (last, next) => {
	let x =
		last.value == next.value; /*  && last.rowExpanded == next.rowExpanded; */
	return x;
};

export default React.memo(ExpandableCell);
