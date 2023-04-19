import { Button, Box } from "@mui/material";
import { HumanName } from "../../classes/dataTypes/HumanName";
import { Identifier } from "../../classes/dataTypes/Identifier";

export const getRenderCellComponent = (resourcesType, element, value) => {
	if (
		typeof value == "string" ||
		typeof value == "number" ||
		typeof value == "boolean"
	) {
		return <div>{String(value)}</div>;
	}

	if (Array.isArray(value)) {
		if (value[0] instanceof HumanName || value[0] instanceof Identifier) {
			return <Box>{value.map((item) => item.getRenderComponent())}</Box>;
		}
		return (
			<Box sx={{ display: "flex", flexDirection: "column" }}>
				{value.map((item) => {
					return <div>{getElementDisplay(value)}</div>;
				})}
			</Box>
		);
	}
	if (value == undefined) return "";
	if (value instanceof HumanName) {
		return value.getRenderComponent();
	}

	return "OTHER";
};

const getElementDisplay = (nestedObject) => {
	if (typeof nestedObject == "string") return nestedObject + " ";
	if (Array.isArray(nestedObject)) {
		let val = "";
		nestedObject.forEach((item) => {
			val = val + getElementDisplay(item);
		});
		return val + "\n";
	}
	if (typeof nestedObject == "object") {
		let val = "";
		let keys = Object.keys(nestedObject);
		keys.forEach((item) => {
			val = val + getElementDisplay(nestedObject[item]);
		});
		return val + "\n";
	}
};
