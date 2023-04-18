import { TextField } from "@mui/material";
import React from "react";
import Testpicker from "../../components/Testpicker";
import { Button } from "@mui/material";
const Test = ({ currentTelecom, onChange }) => {
	return (
		<>
			<TextField value={currentTelecom.value} onChange={onChange} />
			<Button
				onClick={(e) => {
					console.log(currentTelecom);
					console.log(JSON.parse(JSON.stringify(currentTelecom)));
				}}
			>
				check
			</Button>
		</>
	);
};

export default Test;
