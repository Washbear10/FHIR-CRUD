import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import BooleanInput from "../primitiveInputs/BooleanInput";
import IntegerInput from "../primitiveInputs/IntegerInput";
const MultipleBirthInput = ({
	multipleBirthBoolean,
	multipleBirthInteger,
	changeMultipleBirthBoolean,
	changeMultipleBirthInteger,
}) => {
	useEffect(() => {}, [multipleBirthInteger]);

	return (
		<Box sx={{ display: "flex", flexDirection: "row", columnGap: "2rem" }}>
			<BooleanInput
				title="Multiple birth?"
				checked={multipleBirthBoolean} // medplum incorrectly allows strings here -> might return "blablabl"
				changeChecked={changeMultipleBirthBoolean}
			/>
			<Box
				sx={{
					display: "flex",
					gap: "5px",
					flexDirection: "column",
					width: "100%",
					justifyContent: "right",
				}}
			>
				<Typography variant="body2">
					<span style={{ margin: "0px" }}>Number of siblings </span>
					<small style={{ color: "gray" }}>
						(mutually exclusive with the "multiple birth" checkbox")
					</small>
				</Typography>
				<IntegerInput
					label="multipleBirthInteger"
					value={multipleBirthInteger}
					changeValue={changeMultipleBirthInteger}
					negativeAllowed
					min={-2147483648}
					max={2147483647}
				/>
			</Box>
		</Box>
	);
};

export default MultipleBirthInput;
