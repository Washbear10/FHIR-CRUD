import { keyframes, TextField } from "@mui/material";
import React, { memo } from "react";
import * as colors from "@mui/material/colors";
import { useEffect } from "react";

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
				//minWidth: "100px",
			}}
		/>
	);
});

export default SmallTextField;
