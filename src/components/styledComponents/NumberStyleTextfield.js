import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import SmallTextField from "./SmallTextField";

export const NumberStyleTextfield = styled(SmallTextField)(({ theme }) => ({
	"& input[type=number]": {
		"-moz-appearance": "textfield",
	},
	"& input[type=number]::-webkit-outer-spin-button": {
		"-webkit-appearance": "none",
		margin: 0,
	},
	"& input[type=number]::-webkit-inner-spin-button": {
		"-webkit-appearance": "none",
		margin: 0,
	},
}));
