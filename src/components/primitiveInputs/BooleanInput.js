import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import { Box } from "@mui/system";
import React from "react";
const BooleanInput = ({ title, checked, changeChecked, disabled }) => {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "row",
				gap: "10px",
				alignContent: "center",
				alignItems: "end",
			}}
		>
			<FormGroup>
				<FormControlLabel
					sx={{ backgroundColor: "white" }}
					control={
						<Checkbox
							checked={typeof checked == "boolean" ? checked : false}
							disabled={disabled}
						/>
					}
					label={title}
					onChange={(e) => {
						changeChecked(e.target.checked);
					}}
				/>
			</FormGroup>
		</Box>
	);
};

export default BooleanInput;
