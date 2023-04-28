import { Stack, Typography } from "@mui/material";
import React from "react";
/**
 * Style wrapper for a unit of information (component / element)
 */
const Subcomponent = ({ children, title, description, ...rest }) => {
	return (
		<Stack
			sx={
				Object.keys(rest).includes("outer") // if outmost component, show thinner and lighter border
					? {
							border:
								title || description
									? "solid rgba(26, 35, 126, 0.5)"
									: "solid rgba(26, 35, 126, 0.4)",
							borderWidth:
								title || description ? "1px 1px 1px 1px" : "3px 2px 3px 2px",
							borderRadius: "4px",
							padding: "12px",
							maxWidth: "100%",
							boxShadow: " inset  0px 0px 15px -10px #000000",
					  }
					: {
							border:
								title || description
									? "solid rgba(0, 0, 0, 0.966)"
									: "solid rgba(26, 35, 126, 0.4)",
							borderWidth:
								title || description ? "1px 1px 1px 1px" : "3px 2px 3px 2px",
							borderRadius: "4px",
							padding: "12px",
							maxWidth: "100%",
							boxShadow: " inset  0px 0px 15px -10px #000000",
					  }
			}
		>
			{title || description ? (
				<Typography variant="body2" sx={{ marginBottom: "15px" }}>
					<span style={{ fontWeight: "600" }}>{title} </span>
					<small style={{ color: "gray" }}>{description}</small>
				</Typography>
			) : null}
			{children}
		</Stack>
	);
};

export default Subcomponent;
