import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const ExpandableCell = ({ value, lengthThreshhold, rowExpanded }) => {
	const [numLines, setNumLines] = React.useState(value.split("\n").length);
	const [splitString, setSplitString] = React.useState(value.split("\n"));

	return rowExpanded ? (
		<>
			{splitString.map((line) => {
				return (
					<>
						{line}
						<br />
						<br />
					</>
				);
			})}
		</>
	) : (
		splitString[0]
	);
};

ExpandableCell.propTypes = {
	/**
	 * The cell value.
	 * If the column has `valueGetter`, use `params.row` to directly access the fields.
	 */
	value: PropTypes.any,
};

export default ExpandableCell;

/* 
					<Link
						type="button"
						component="button"
						underline="none"
						sx={{ fontSize: "inherit", ml: "2px" }}
						onClick={() => setExpanded(!expanded)}
					>
						{expanded ? (
							<Box sx={{ display: "flex", justifyContent: "center" }}>
								<KeyboardArrowUpIcon />
								<span>view less</span>
							</Box>
						) : (
							<Box sx={{ display: "flex", justifyContent: "center" }}>
								<KeyboardArrowDownIcon />
								view more
							</Box>
						)}
					</Link> */
