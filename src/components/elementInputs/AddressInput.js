import React from "react";
import Address from "../../classes/dataTypes/Address";
import { Box } from "@mui/system";
import CodeInput from "../primitiveInputs/CodeInput";
import SmallTextField from "../styledComponents/SmallTextField";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Button, IconButton } from "@mui/material";

const useValues = ["home", "work", "temp", "old", "billing"];
const typeValues = ["postal", "physical", "both"];
const AddressInput = ({ address, changeSingleAddress }) => {
	const handleChangeUse = (newValue) => {
		let newAddress = new Address({ ...address, use: newValue });
		changeSingleAddress(newAddress, address);
	};
	const handleChangeType = (newValue) => {
		let newAddress = new Address({ ...address, type: newValue });
		changeSingleAddress(newAddress, address);
	};
	const handleChangeText = (newValue) => {
		let newAddress = new Address({ ...address, text: newValue });
		changeSingleAddress(newAddress, address);
	};
	const handleChangeCity = (newValue) => {
		let newAddress = new Address({ ...address, city: newValue });
		changeSingleAddress(newAddress, address);
	};
	const handleChangeDistrict = (newValue) => {
		let newAddress = new Address({ ...address, district: newValue });
		changeSingleAddress(newAddress, address);
	};
	const handleChangeState = (newValue) => {
		let newAddress = new Address({ ...address, state: newValue });
		changeSingleAddress(newAddress, address);
	};
	const handleChangePostalCode = (newValue) => {
		let newAddress = new Address({ ...address, postalCode: newValue });
		changeSingleAddress(newAddress, address);
	};
	const handleChangeCountry = (newValue) => {
		let newAddress = new Address({ ...address, country: newValue });
		changeSingleAddress(newAddress, address);
	};

	const removeEmptyLines = () => {
		let newLines = address.line.filter((item) => item != "");
		if (newLines.length == 0) {
			newLines = [""];
		}
		let newAddress = new Address({
			...address,
			line: newLines,
		});
		changeSingleAddress(newAddress, address);
	};
	const changeSingleLine = (oldLineIndex, newLine) => {
		let newLines = [...address.line];
		newLines[oldLineIndex] = newLine;
		let newAddress = new Address({
			...address,
			line: newLines,
		});
		changeSingleAddress(newAddress, address);
	};
	const addLine = () => {
		if (address.line) {
			if (!address.line.includes("")) {
				let newAddress = new Address({
					...address,
					line: [...address.line, ""],
				});
				changeSingleAddress(newAddress, address);
			}
		}
	};
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "start",
				justifyContent: "center",
				rowGap: "1rem",
				height: "100%",
			}}
		>
			<Box sx={{ display: "flex", columnGap: "0.5rem", width: "100%" }}>
				{" "}
				<SmallTextField
					label="country"
					value={address.country || ""}
					onChange={(e) => {
						handleChangeCountry(e.target.value);
					}}
				/>{" "}
				<SmallTextField
					label="state"
					value={address.state || ""}
					onChange={(e) => {
						handleChangeState(e.target.value);
					}}
				/>
				<SmallTextField
					label="city"
					value={address.city || ""}
					onChange={(e) => {
						handleChangeCity(e.target.value);
					}}
				/>
				<SmallTextField
					label="district"
					value={address.district || ""}
					onChange={(e) => {
						handleChangeDistrict(e.target.value);
					}}
				/>
				<SmallTextField
					label="postalCode"
					value={address.postalCode || ""}
					onChange={(e) => {
						handleChangePostalCode(e.target.value);
					}}
				/>{" "}
			</Box>
			<Box sx={{ display: "flex", columnGap: "0.5rem", width: "100%" }}>
				{address.line
					? address.line
							.map((singleLine, index) => {
								return { singleLine: singleLine, index: index };
							})
							.map((singleLine) => (
								<SmallTextField
									className="lineInput"
									value={singleLine.singleLine}
									key={singleLine.index}
									/* autoFocus={!sf.suffix && sf.key === name.suffix.length - 1} */
									label="Line"
									onChange={(event) => {
										changeSingleLine(singleLine.index, event.target.value);
									}}
									onBlur={(e) => {
										if (
											singleLine.singleLine == "" ||
											e.relatedTarget == null ||
											!e.relatedTarget.closest(".lineInput")
										)
											removeEmptyLines();
									}}
									width="300px"
								/>
							))
					: null}
				<IconButton
					variant="outlined"
					color="primary"
					onClick={addLine}
					sx={{ marginY: "5px" }}
					size="small"
					disabled={!address.line || address.line.includes("")}
				>
					<AddCircleOutlineIcon fontSize="small" />
				</IconButton>
			</Box>
			<Box sx={{ display: "flex", columnGap: "0.5rem", width: "100%" }}>
				<CodeInput
					values={useValues}
					label="use"
					v={address.use || ""}
					changeInput={(value) => {
						handleChangeUse(value);
					}}
				/>
				<CodeInput
					values={typeValues}
					label="type"
					v={address.type || ""}
					changeInput={(value) => {
						handleChangeType(value);
					}}
				/>{" "}
				<SmallTextField
					label="text"
					value={address.text || ""}
					onChange={(e) => {
						handleChangeText(e.target.value);
					}}
				/>
			</Box>
		</Box>
	);
};

export default AddressInput;
