import React from "react";
import { Box } from "@mui/system";
import BooleanInput from "../primitiveInputs/BooleanInput";
import { Typography } from "@mui/material";
import DateTabs from "../common/DateTabs";

const DeceasedInput = ({
	deceasedBoolean,
	deceasedDateTime,
	changeDeceasedBoolean,
	changeDeceasedDateTime,
}) => {
	return (
		<Box sx={{ display: "flex", flexDirection: "row", columnGap: "2rem" }}>
			<BooleanInput
				title="Deceased"
				checked={deceasedBoolean} // medplum incorrectly allows strings here -> might return "blablabl"
				changeChecked={changeDeceasedBoolean}
			/>

			<Box
				sx={{
					display: "flex",
					gap: "0px",
					flexDirection: "column",
					width: "100%",
					justifyContent: "right",
				}}
			>
				<Typography variant="body2">
					<span style={{ margin: "0px" }}>Time of death </span>
					<small style={{ color: "gray" }}>
						(mutually exclusive with the "Deceased" checkbox")
					</small>
				</Typography>
				<DateTabs
					value={deceasedDateTime}
					label="Deceased Datetime"
					typeOfDate="dateTime"
					changeDateTime={changeDeceasedDateTime}
					disableFuture={true}
					disabled={true}
					width={window.DEFAULTDATETABSWIDTH}
				/>
			</Box>
		</Box>
	);
};

export default DeceasedInput;
