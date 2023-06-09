import { TextField } from "@mui/material";
import * as colors from "@mui/material/colors";
import React from "react";

const SmallTextField = React.forwardRef((props, ref) => {
	return (
		<TextField
			{...props}
			ref={ref}
			size="small"
			sx={{
				svg: { color: colors.indigo[900] },
				width: props.width ? props.width : null,
				backgroundColor: "white",
				"& .MuiOutlinedInput-root": {
					"&:hover fieldset": {
						borderColor: Object.keys(props).includes("overallColor")
							? props["overallColor"]
							: null,
					},
					"& fieldset": {
						borderColor: props["overallColor"] ? props["overallColor"] : null,
					},
				},

				//minWidth: "100px",
			}}
		/>
	);
});

export default SmallTextField;
