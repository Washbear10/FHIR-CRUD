import React, { memo } from "react";
import { Box } from "@mui/system";
import SmallTextField from "../styledComponents/SmallTextField";
import BooleanInput from "../primitiveInputs/BooleanInput";
import { useEffect } from "react";
import Coding from "../../classes/dataTypes/Coding";
import { Button } from "@mui/material";
import { useState } from "react";
const CodingInput = ({ coding, changeCoding, focus }) => {
	useEffect(() => {}, []);

	const handleChangeSystem = (newValue) => {
		let newCoding = new Coding({ ...coding, system: newValue });
		changeCoding(newCoding, coding);
	};
	const handleChangeVersion = (newValue) => {
		let newCoding = new Coding({ ...coding, version: newValue });
		changeCoding(newCoding, coding);
	};
	const handleChangeCode = (newValue) => {
		let newCoding = new Coding({ ...coding, code: newValue });
		changeCoding(newCoding, coding);
	};
	const handleChangeDisplay = (newValue) => {
		let newCoding = new Coding({
			...coding,
			display: newValue,
		});
		changeCoding(newCoding, coding);
	};
	const handleChangeUserSelected = (newValue) => {
		let value = typeof newValue === "boolean" ? newValue : null;
		let newCoding = new Coding({
			...coding,
			userSelected: value,
		});
		changeCoding(newCoding, coding);
	};

	return (
		<Box sx={{ display: "flex", columnGap: "5px" }}>
			{coding ? (
				<SmallTextField
					value={coding.system ? coding.system : ""}
					label="system"
					onChange={(e) => {
						handleChangeSystem(e.target.value);
					}}
					className="systemInput"
				/>
			) : null}
			{coding ? (
				<SmallTextField
					value={coding.version ? coding.version : ""}
					label="version"
					onChange={(e) => {
						handleChangeVersion(e.target.value);
					}}
					className="versionInput"
				/>
			) : null}
			{coding ? (
				<SmallTextField
					value={coding.code ? coding.code : ""}
					label="code"
					onChange={(e) => {
						handleChangeCode(e.target.value);
					}}
					className="codeInput"
				/>
			) : null}
			{coding ? (
				<SmallTextField
					value={coding.display ? coding.display : ""}
					label="display"
					onChange={(e) => {
						handleChangeDisplay(e.target.value);
					}}
					className="displayInput"
				/>
			) : null}
			<BooleanInput
				checked={
					coding ? (coding.userSelected ? coding.userSelected : null) : null
				}
				title="userSelected"
				changeChecked={handleChangeUserSelected}
			/>
		</Box>
	);
};

export default CodingInput;

/* function areEqual(prev, next) {
	return prev.coding == next.coding;
}
export default memo(CodingInput, areEqual); */
