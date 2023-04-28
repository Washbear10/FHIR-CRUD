import { Box } from "@mui/system";
import React, { useEffect } from "react";
import CodeInput from "../primitiveInputs/CodeInput";
import { genders } from "../../utilities/valueSets/valueSets";

const GenderInput = ({ gender, changeGender }) => {
	useEffect(() => {}, [gender]);

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
			<CodeInput
				values={genders}
				v={gender || null}
				label="Gender"
				changeInput={changeGender}
			/>
		</Box>
	);
};

export default GenderInput;
/* function areEqual(prev, next) {
	return prev.gender == next.gender;
}
export default memo(GenderInput, areEqual); */
