import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

export const DisabledTextField = styled(TextField)(({ theme }) => ({
	backgroundColor: "white",
	"& .MuiInputBase-input.Mui-disabled": {
		WebkitTextFillColor: "black",
		"&:hover": {
			cursor: "not-allowed",
		},
	},
}));
