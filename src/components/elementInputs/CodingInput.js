import React, { memo } from "react";
import { Box } from "@mui/system";
import SmallTextField from "../styledComponents/SmallTextField";
import BooleanInput from "../primitiveInputs/BooleanInput";
import { useEffect } from "react";
import Coding from "../../classes/dataTypes/Coding";
import { Button } from "@mui/material";
import { useState } from "react";
import CodeInput from "../primitiveInputs/CodeInput";
import { AttributeBlockErrorContext } from "../../utilities/AttributeBlockErrorContext";
import { useContext, useRef } from "react";
import { isObjectEmptyRecursive } from "../../utilities/fhirify";
const CodingInput = ({
	coding,
	changeCoding,
	defaultSystem,
	systemUneditable,
	systemValueCombinationRequired,
	bindingCodes,
}) => {
	const [errorMessage, setErrorMessage] = useState("");

	const {
		attributeBlockError,
		setAttributeBlockError,
		attributeBlockErrorMessage,
		setAttributeBlockErrorMessage,
	} = useContext(AttributeBlockErrorContext);

	const wasMounted = useRef(false);
	useEffect(() => {
		if (!wasMounted) {
			wasMounted.current = true;
			return;
		}
		if (
			systemValueCombinationRequired &&
			!coding.system &&
			!coding.value &&
			!isObjectEmptyRecursive(coding)
		) {
			setErrorMessage("System and value must be supplied together.");
		} else {
			setErrorMessage("");
		}
	}, [coding]);

	const handleChangeSystem = (newValue) => {
		let newCoding = new Coding({ ...coding, system: newValue });
		changeCoding(newCoding, coding);
	};
	const handleChangeVersion = (newValue) => {
		let newCoding = new Coding({ ...coding, version: newValue });
		changeCoding(newCoding, coding);
	};
	const handleChangeCode = (newValue) => {
		let newCoding;
		if (!newValue) {
			newCoding = new Coding({
				...coding,
				code: null,
				system: null,
			});
		} else if (coding.system == null && defaultSystem) {
			newCoding = new Coding({
				...coding,
				code: newValue,
				system: defaultSystem,
			});
		} else newCoding = new Coding({ ...coding, code: newValue });
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
			<SmallTextField
				value={
					coding.system !== null && coding.system !== undefined
						? coding.system
						: defaultSystem
						? defaultSystem
						: ""
				}
				label="system"
				disabled={systemUneditable}
				onChange={(e) => {
					handleChangeSystem(e.target.value);
				}}
				className="systemInput"
				error={errorMessage && !systemUneditable ? 1 : 0}
				helperText={errorMessage && !systemUneditable ? errorMessage : null}
			/>

			{bindingCodes ? (
				<CodeInput
					v={coding.code}
					values={bindingCodes}
					changeInput={(newValue) => {
						/* handleChangeTextCode(rest["textValueSet"][newValue]); */
						handleChangeCode(newValue);
					}}
					label={"code"}
					clearOnBlur={true}
					error={errorMessage ? 1 : 0}
					helpertext={errorMessage}

					/* renderOption={(props, option) => (
						<Box
							component="li"
							{...props}
							sx={{ display: "flex", justifyContent: "start", gap: "1rem" }}
							key={option}
						>
							<Typography variant="subtitle1">{option}</Typography>
							<Typography variant="subtitle2">
								{rest["textValueSet"][option]}
							</Typography>
						</Box>
					)}
					filterOptions={(options, inputval) => {
						let filtered = options.filter((option) => {
							return (
								option
									.toLowerCase()
									.includes(inputval.inputValue.toLowerCase()) ||
								rest["textValueSet"][option]
									.toLowerCase()
									.includes(inputval.inputValue.toLowerCase())
							);
						});
						return filtered;
					}}
					getOptionLabel={(option) => {
						return option + " (" + rest["textValueSet"][option] + ")";
					}} */
					/* error={rest.error}
					helperText={rest.helperText} */
				/>
			) : (
				<SmallTextField
					value={coding.code ? coding.code : ""}
					label="code"
					onChange={(e) => {
						handleChangeCode(e.target.value);
					}}
					className="codeInput"
					error={errorMessage ? 1 : 0}
					helpertext={errorMessage}
				/>
			)}

			<SmallTextField
				value={coding.version ? coding.version : ""}
				label="version"
				onChange={(e) => {
					handleChangeVersion(e.target.value);
				}}
				className="versionInput"
			/>
			<SmallTextField
				value={coding.display ? coding.display : ""}
				label="display"
				onChange={(e) => {
					handleChangeDisplay(e.target.value);
				}}
				className="displayInput"
			/>
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
