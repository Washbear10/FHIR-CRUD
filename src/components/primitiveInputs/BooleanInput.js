import React, { memo } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Box } from "@mui/system";
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
/* function areEqual(prev, next) {
	return (
		prev.title == next.title &&
		prev.checked == next.checked &&
		prev.disabled == next.disabled
	);
}
export default memo(BooleanInput, areEqual); */
export default BooleanInput;
