import { Button, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

export const SearchButton = styled(Button)(({ theme }) => ({
	"&.MuiButtonBase-root:hover": {
		bgcolor: "transparent",
	},
}));
